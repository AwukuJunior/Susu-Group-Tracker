const readline = require("readline");
const Group = require("./src/Group");

// Helper: convert GHS input to pesewas (integer)
function toPesewas(ghsInput) {
  return Math.round(parseFloat(ghsInput) * 100);
}

// Helper: convert pesewas to GHS string
function toGHS(pesewas) {
  return (pesewas / 100).toFixed(2);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Wrapper so we can use async/await with readline
function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log("Welcome to the Susu Group Tracker!\n");

  const groupName = await ask("Enter group name: ");
  const weeklyInput = await ask("Enter weekly contribution amount (GHS): ");
  const weeklyAmount = toPesewas(weeklyInput);

  const group = new Group(groupName, weeklyAmount);
  console.log(
    `\nGroup "${groupName}" created with weekly amount ${toGHS(weeklyAmount)} GHS.\n`,
  );

  let running = true;
  while (running) {
    console.log("========================================");
    console.log("  SUSU GROUP TRACKER");
    console.log("========================================");
    console.log("1. Add Member");
    console.log("2. Record Payment");
    console.log("3. Close Week");
    console.log("4. Show Report");
    console.log("5. Exit");
    console.log("========================================");

    const choice = await ask("Choose an option: ");

    try {
      if (choice === "1") {
        const name = await ask("Enter member name: ");
        group.addMember(name);
      } else if (choice === "2") {
        const name = await ask("Enter member name: ");
        const amountInput = await ask("Enter payment amount (GHS): ");
        const amount = toPesewas(amountInput);
        group.recordPayment(name, amount);
      } else if (choice === "3") {
        const result = group.closeWeek();
        console.log(`\n${result.message}\n`);
      } else if (choice === "4") {
        console.log(`\n${group.getReport()}\n`);
      } else if (choice === "5") {
        console.log("Goodbye!");
        running = false;
      } else {
        console.log("Invalid option. Please choose 1-5.\n");
      }
    } catch (error) {
      console.log(`\n❌ Error: ${error.message}\n`);
    }
  }

  rl.close();
}

main();
