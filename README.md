# Database script quick docs (functions/utils/databaseHelpers.ts)

## executeSelectQuery
Example usage
```typescript
const queryString = `SELECT * FROM ${TABLE} LIMIT ?, ?;`;

return await executeSelectQuery<IAttendee[]>(queryString, [from, limit]);
```
The above code will return a list of Attendees, based on the query string provided,
and two extra variables that got replaced.

> Can return: Promise with: The generic type given, or undefined if nothing returned.

> Can throw: MysqlError on failure.

## executeInsertQuery
Example usage
```typescript
const insertString = `INSERT INTO ${TABLE} SET ?`;

return await executeInsertQuery(insertString, attendee);
```
The above code will insert a model into the database, in this case, attendee.
If using '?' after set, everything else can be omitted, and a model passed as the value to be replaced.

> Can return: Promise with: Number, which is the ID of the inserted row.

> Can throw: MysqlError on failure.

## executeUpdateQuery
Example usage
```typescript
const query = `UPDATE ${TABLE} SET firstName = ? WHERE id = ?;`;

const result = await executeUpdateQuery(query, ["Foxy", 3]);
```
The above code will update a given table, with placeholders replaced.
Similarly to insert, you may also pass an entire model to a placeholder after SET.
((MORE TESTING NEEDED TO VERIFY!!!))

> Can return: Promise with: Number of rows affected.

> Can throw: MysqlError on failure.

[//]: # (This is a [Next.js]&#40;https://nextjs.org/&#41; project bootstrapped with [`create-next-app`]&#40;https://github.com/vercel/next.js/tree/canary/packages/create-next-app&#41;.)

[//]: # ()
[//]: # (## Getting Started)

[//]: # ()
[//]: # (First, run the development server:)

[//]: # ()
[//]: # (```bash)

[//]: # (npm run dev)

[//]: # (# or)

[//]: # (yarn dev)

[//]: # (```)

[//]: # ()
[//]: # (Open [http://localhost:3000]&#40;http://localhost:3000&#41; with your browser to see the result.)

[//]: # ()
[//]: # (You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.)

[//]: # ()
[//]: # ([API routes]&#40;https://nextjs.org/docs/api-routes/introduction&#41; can be accessed on [http://localhost:3000/api/hello]&#40;http://localhost:3000/api/hello&#41;. This endpoint can be edited in `pages/api/hello.ts`.)

[//]: # ()
[//]: # (The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes]&#40;https://nextjs.org/docs/api-routes/introduction&#41; instead of React pages.)

[//]: # ()
[//]: # (## Learn More)

[//]: # ()
[//]: # (To learn more about Next.js, take a look at the following resources:)

[//]: # ()
[//]: # (- [Next.js Documentation]&#40;https://nextjs.org/docs&#41; - learn about Next.js features and API.)

[//]: # (- [Learn Next.js]&#40;https://nextjs.org/learn&#41; - an interactive Next.js tutorial.)

[//]: # ()
[//]: # (You can check out [the Next.js GitHub repository]&#40;https://github.com/vercel/next.js/&#41; - your feedback and contributions are welcome!)

[//]: # ()
[//]: # (## Deploy on Vercel)

[//]: # ()
[//]: # (The easiest way to deploy your Next.js app is to use the [Vercel Platform]&#40;https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme&#41; from the creators of Next.js.)

[//]: # ()
[//]: # (Check out our [Next.js deployment documentation]&#40;https://nextjs.org/docs/deployment&#41; for more details.)
