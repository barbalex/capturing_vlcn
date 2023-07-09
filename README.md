# vite-starter

```
git clone git@github.com:vlcn-io/vite-starter.git
pnpm install
pnpm dev
```

What you get:

- A client ([App.tsx](https://github.com/vlcn-io/vite-starter/blob/main/src/App.tsx)) that runs a SQLite DB
- A server ([server.js](https://github.com/vlcn-io/vite-starter/blob/main/server.js)) that the client (or many clients) can sync to when online
- A database schema file ([schame.mjs](https://github.com/vlcn-io/vite-starter/blob/main/src/schemas/main.mjs) that is automatically migrated to (auto migration is still in beta! You may find yourself needing to wipe the DB (clear indexeddb or change dbid) when using auto-migrate) on server and client restart.

Demo Video: [![example scaffolding result](https://img.youtube.com/vi/QJBQLYmXReI/0.jpg)](https://www.youtube.com/watch?v=QJBQLYmXReI)

Deployed Scaffolding: https://vite-starter.fly.dev/ Try it out! Collaborate between all your devices.

# important

not using pnpm, did NOT work on windows
need to run in ubuntu
