import styles from "./styles/page.module.scss";

import Claims from "./components/claims/claims";
import FormClaim from "./components/formClaim/formClaim";
import Heading from "./components/heading/heading";
import Payments from "./components/payments/payments";
import { Tabs, TabsProps } from "./lib/antd";

export default function Home() {
  const claimsData = [
    {
      title: "Defect computer",
      content:
        "After thourough examination we had to deny this claim, since it appears you tried to clean your computer",
    },
    {
      title: "Stolen Bicycle",
      content:
        "Your before and after pictures are clear evidence that your bicycle has been stolen",
    },
    {
      title: "Stolen Bicycle",
      content:
        "Your before and after pictures are clear evidence that your bicycle has been stolen",
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Overview`,
      children: (
        <div className={styles.claimsWrapper}>
          <Claims
            title={`Open claims (${claimsData?.length})`}
            items={claimsData}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: `Payments`,
      children: <Payments />,
    },
    {
      key: "3",
      label: `Submit claim`,
      children: <FormClaim />,
    },
  ];

  return (
    <main className={styles.main}>
      <Heading />
      <Tabs
        tabBarStyle={{ color: "white" }}
        defaultActiveKey="1"
        items={items}
      />
    </main>
  );
}
