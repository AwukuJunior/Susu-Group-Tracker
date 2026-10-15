class Member {
  constructor(id, name) {
    this.id = id;
    this.name = name;

    this.amountPaidThisWeek = 0;
    this.totalPaidEver = 0;
    this.totalReceived = 0;
    this.hasReceivedPayout = false;
  }
}

module.exports = Member;
