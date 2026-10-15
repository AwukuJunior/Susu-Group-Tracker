const Group = require("../src/Group");

describe("Group", () => {
  let group;

  // Runs before every test — fresh group each time
  beforeEach(() => {
    group = new Group("Test Susu", 5000); // 50.00 GHS weekly
  });

  // Test 1: Group creation
  test("should create a group with correct name and weekly amount", () => {
    expect(group.name).toBe("Test Susu");
    expect(group.weeklyAmount).toBe(5000);
    expect(group.currentWeek).toBe(1);
    expect(group.members.length).toBe(0);
  });

  // Test 2: Add a member
  test("should add a member to the group", () => {
    group.addMember("Ama");
    expect(group.members.length).toBe(1);
    expect(group.members[0].name).toBe("Ama");
    expect(group.members[0].id).toBe(1);
  });

  // Test 3: Reject duplicate member names
  test("should reject duplicate member names", () => {
    group.addMember("Ama");
    expect(() => group.addMember("Ama")).toThrow("Member already exists");
  });

  // Test 4: Reject payment for unknown member
  test("should reject payment for an unknown member", () => {
    group.addMember("Ama");
    expect(() => group.recordPayment("Kofi", 5000)).toThrow("Unknown member");
  });

  // Test 5: Reject zero or negative payments
  test("should reject zero or negative payments", () => {
    group.addMember("Ama");
    expect(() => group.recordPayment("Ama", 0)).toThrow();
    expect(() => group.recordPayment("Ama", -100)).toThrow();
  });

  // Test 6: Reject overpayment
  test("should reject payments above what the member owes", () => {
    group.addMember("Ama");
    expect(() => group.recordPayment("Ama", 6000)).toThrow();
  });

  // Test 7 (REQUIRED): Partial payment
  test("should accept a partial payment and track the remaining balance", () => {
    group.addMember("Ama");
    group.recordPayment("Ama", 3000);
    const ama = group.members[0];
    expect(ama.amountPaidThisWeek).toBe(3000);
    expect(ama.totalPaidEver).toBe(3000);
    // She still owes 2000
    expect(group.weeklyAmount - ama.amountPaidThisWeek).toBe(2000);
  });

  // Test 8 (REQUIRED): Week cannot close
  test("should not close the week if any member has not paid in full", () => {
    group.addMember("Ama");
    group.addMember("Kofi");
    group.recordPayment("Ama", 5000);
    group.recordPayment("Kofi", 3000); // Kofi short

    const result = group.closeWeek();
    expect(result.success).toBe(false);
    expect(result.message).toContain("Kofi");
    expect(result.message).toContain("20.00"); // Kofi owes 20.00 GHS
    expect(group.currentWeek).toBe(1); // Week did NOT advance
  });

  // Test 9: Successful close and payout
  test("should close the week and pay the pot to the first member", () => {
    group.addMember("Ama");
    group.addMember("Kofi");
    group.recordPayment("Ama", 5000);
    group.recordPayment("Kofi", 5000);

    const result = group.closeWeek();
    expect(result.success).toBe(true);
    expect(result.recipient).toBe("Ama");
    expect(result.amount).toBe(10000); // 100.00 GHS total pot
    expect(group.currentWeek).toBe(2);
  });

  // Test 10: State resets after close
  test("should reset weekly payments and advance the week after a successful close", () => {
    group.addMember("Ama");
    group.addMember("Kofi");
    group.recordPayment("Ama", 5000);
    group.recordPayment("Kofi", 5000);

    group.closeWeek();

    // Everyone's weekly payment should be reset
    expect(group.members[0].amountPaidThisWeek).toBe(0);
    expect(group.members[1].amountPaidThisWeek).toBe(0);

    // Ama should have received the pot
    expect(group.members[0].hasReceivedPayout).toBe(true);
    expect(group.members[0].totalReceived).toBe(10000);

    // Kofi hasn't received a payout yet
    expect(group.members[1].hasReceivedPayout).toBe(false);

    // History should have one entry
    expect(group.history.length).toBe(1);
  });
});
