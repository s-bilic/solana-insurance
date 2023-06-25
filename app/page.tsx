import styles from "./styles/page.module.scss";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "./lib/auth";
import Claims from "./components/claims/claims";
import FormClaim from "./components/formClaim/formClaim";
import Heading from "./components/heading/heading";
import Payments from "./components/payments/payments";
import { prisma } from "./lib/prisma";
import Tabs from "./components/tabs/tabs";

export default async function Home() {
  const claimsData = await prisma.claim.findMany();
  // const { session } = await getServerSession(authOptions);
  // console.log(session);

  // const claimsData = [
  //   {
  //     title: "Defect computer",
  //     content:
  //       "After thourough examination we had to deny this claim, since it appears you tried to clean your computer",
  //   },
  //   {
  //     title: "Stolen Bicycle",
  //     content:
  //       "Your before and after pictures are clear evidence that your bicycle has been stolen",
  //   },
  //   {
  //     title: "Stolen Bicycle",
  //     content:
  //       "Your before and after pictures are clear evidence that your bicycle has been stolen",
  //   },
  // ];

  return (
    <main className={styles.main}>
      <Heading />
      <Tabs claimsData={claimsData} />
    </main>
  );
}
