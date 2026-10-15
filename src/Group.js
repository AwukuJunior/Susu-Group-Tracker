const Member = require("./Member");
class Group {
  constructor(name, weeklyAmount) {
    this.name = name;
    this.weeklyAmount = weeklyAmount;

    this.currentWeek = 1;
    this.members = [];
    this.history = [];
  }
  addMember(name) {
    //Defensive check
    if (this.currentWeek > 1) {
      throw new Error("Cannot add members after week 1");
    }

    //Checking for duplication
    if (this.members.find((member) => member.name === name)) {
      throw new Error("Member already exists");
    }

    //Create a new member
    let uniqueId = this.members.length + 1;
    let newMember = new Member(uniqueId, name);
    this.members.push(newMember);

    console.log(`Added member: ${name} with ID: ${uniqueId}`);
  }
  recordPayment(memberName, amount) {
    // Finding the member
    const member = this.members.find((m) => m.name === memberName);
    if (!member) {
      throw new Error(`Unknown member: ${memberName}`);
    }

    // Validating the amount
    if (amount <= 0) {
      throw new Error("Payment amount must be greater than zero.");
    }

    //Calculating what they still owe for this week
    const amountOwed = this.weeklyAmount - member.amountPaidThisWeek;

    // Preventing overpayment
    if (amount > amountOwed) {
      throw new Error(
        `${memberName} only owes ${(amountOwed / 100).toFixed(2)} GHS for Week ${this.currentWeek}. ` +
          `You tried to pay ${(amount / 100).toFixed(2)} GHS.`,
      );
    }

    // Updating the member's records
    member.amountPaidThisWeek += amount;
    member.totalPaidEver += amount;

    // Logging a success message
    const remaining = this.weeklyAmount - member.amountPaidThisWeek;
    if (remaining === 0) {
      console.log(
        `✅ ${memberName} has fully paid for Week ${this.currentWeek}.`,
      );
    } else {
      console.log(
        `💰 ${memberName} paid ${(amount / 100).toFixed(2)} GHS. ` +
          `Still owes ${(remaining / 100).toFixed(2)} GHS for Week ${this.currentWeek}.`,
      );
    }
  }

  closeWeek() {
    // Guard: cannot close a week with no members
    if (this.members.length === 0) {
      return {
        success: false,
        message: "Cannot close the week: no members in the group yet.",
      };
    }

    // Phase A: Validation - check if everyone has paid in full
    const membersWhoOwe = [];
    for (const member of this.members) {
      const amountOwed = this.weeklyAmount - member.amountPaidThisWeek;
      if (amountOwed > 0) {
        membersWhoOwe.push({ name: member.name, owes: amountOwed });
      }
    }

    if (membersWhoOwe.length > 0) {
      let message = `Cannot close Week ${this.currentWeek}. The following members still owe:\n`;
      for (const entry of membersWhoOwe) {
        message += `  - ${entry.name} owes ${(entry.owes / 100).toFixed(2)} GHS\n`;
      }
      return { success: false, message: message.trim() };
    }

    // Phase B: Edge Case - has the cycle completed?
    if (this.currentWeek - 1 >= this.members.length) {
      return {
        success: false,
        message: "Cycle complete. All members have received their payout.",
      };
    }

    // Phase C: Determine the recipient
    const recipientIndex = this.currentWeek - 1;
    const recipient = this.members[recipientIndex];
    const totalPot = this.weeklyAmount * this.members.length;

    // Phase D: Execute the payout
    recipient.hasReceivedPayout = true;
    recipient.totalReceived += totalPot;

    this.history.push({
      weekNumber: this.currentWeek,
      recipientId: recipient.id,
      recipientName: recipient.name,
      totalPotAmount: totalPot,
      date: new Date().toISOString(),
    });

    // Reset everyone's weekly payment for the new week
    for (const member of this.members) {
      member.amountPaidThisWeek = 0;
    }

    this.currentWeek += 1;

    return {
      success: true,
      message: `Week ${this.currentWeek - 1} closed. ${recipient.name} received ${(totalPot / 100).toFixed(2)} GHS. Week ${this.currentWeek} begins.`,
      recipient: recipient.name,
      amount: totalPot,
    };
  }
  getReport() {
    let report = "";

    // Section 1: Group Summary
    report += `----------------------------------------\n`;
    report += `  SUSU GROUP: ${this.name}\n`;
    report += `----------------------------------------\n`;
    report += `Weekly Amount: ${(this.weeklyAmount / 100).toFixed(2)} GHS\n`;
    report += `Current Week: ${this.currentWeek}\n`;
    report += `Total Members: ${this.members.length}\n`;
    report += `\n`;

    // Section 2: This Week's Payment Status
    report += `--- Week ${this.currentWeek} Payment Status ---\n`;
    if (this.members.length === 0) {
      report += `No members in the group yet.\n`;
    } else {
      for (const member of this.members) {
        const remaining = this.weeklyAmount - member.amountPaidThisWeek;
        const paidSoFar = (member.amountPaidThisWeek / 100).toFixed(2);
        if (remaining === 0) {
          report += `  ${member.name}: Paid in full ✅ (${paidSoFar} GHS)\n`;
        } else {
          report += `  ${member.name}: Paid ${paidSoFar} GHS, still owes ${(remaining / 100).toFixed(2)} GHS\n`;
        }
      }
    }
    report += `\n`;

    // Section 3: Payout History
    report += `--- Payout History ---\n`;
    if (this.history.length === 0) {
      report += `No payouts yet.\n`;
    } else {
      for (const entry of this.history) {
        const amount = (entry.totalPotAmount / 100).toFixed(2);
        const date = new Date(entry.date).toLocaleDateString();
        report += `  Week ${entry.weekNumber}: ${entry.recipientName} received ${amount} GHS on ${date}\n`;
      }
    }
    report += `----------------------------------------\n`;

    return report;
  }
}

module.exports = Group;
