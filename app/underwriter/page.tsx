import styles from "../styles/underwriter.module.scss";
import Tabs from "../components/tabs/tabs";
import UnderwriterClaims from "app/components/underwriterClaims/underwriterClaims";
import { prisma } from "app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "app/lib/auth";
import { notFound } from "next/navigation";
export default async function Underwriter() {
  const session = await getServerSession(authOptions);
  const claimsData = await prisma.claim.findMany({ orderBy: { id: "desc" } });
  if (
    !process.env.UNDERWRITER_ADDRESS.split(", ").includes(session?.publicKey)
  ) {
    return notFound();
  }

  return (
    <main className={styles.main}>
      <Tabs
        items={[
          {
            key: "1",
            label: `Overview`,
            children: <UnderwriterClaims data={claimsData} />,
          },
        ]}
      />
    </main>
  );
}
