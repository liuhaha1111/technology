import { app } from "./app";

const port = Number(process.env.PORT ?? 3200);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`admin-backend listening on ${port}`);
});
