# Notes & Assumptions

## Design Assumptions

The assignment instructions did not cover several scenarios. The following rules were chosen as sensible decisions:

1. Late Joiners: Not allowed. Once Week 1 begins, the group is locked. This prevents mathematical unfairness where early joiners would receive smaller pots than late joiners.
2. Members Leaving: Not allowed mid-cycle. Members must wait until the current cycle ends before leaving. The program does not support removing members.
3. Money Handling: All money is stored as integers (pesewas) to prevent floating-point rounding errors. For example, 50.00 GHS is stored as 5000.
4. Multiple Groups: The program supports only one group per run.
5. End of Cycle: Once all members have received a payout once, the cycle is complete. The program reports this and stops accepting further week closures. To start a new cycle, the admin restarts the program. This keeps the scope focused on the assignment's requirements.
6. Member IDs: Since late joining and leaving are disallowed, generating IDs using members.length + 1 is safe from duplicates.
7. Payment Timing: If a member pays "for a past week" after the week has closed, the system records the payment against the current week instead. Since we reset `amountPaidThisWeek` on every successful close, this behavior is automatic and requires no special handling.

## Technical Decisions

- Language: JavaScript (Node.js)
- Testing Framework: Jest
- Interface: Command Line Interface (CLI) with a menu
- Architecture: Two classes — Member and Group
- Member Data: Kept lean (id, name, payment tracking) since email/age are not needed for Susu math.

## Improvements with More Time

- Add data persistence so data survives program restarts.
- Support multiple groups.
- Add a proper user interface (web or mobile).
- Add role-based access.
- Handle the late joiner penalty fund scenario.

## On the Use of AI

I used an AI assistant as a design partner throughout this project.
All code was written by me, and all architectural decisions were
made by me. The AI was used to ask guiding questions, review code
for issues, and challenge my reasoning — similar to a code review
or pair-programming session. Key decisions (integer-based money
handling, no late joiners, defensive guard clauses) were my own.
