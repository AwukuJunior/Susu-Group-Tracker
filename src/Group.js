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

    // Step 5: Update the member's records
    member.amountPaidThisWeek += amount;
    member.totalPaidEver += amount;

    // Step 6: Log a success message
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
}

module.exports = Group;
