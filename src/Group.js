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
}

module.exports = Group;
