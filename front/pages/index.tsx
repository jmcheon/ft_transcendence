import Head from "next/head";
import Link from "next/link";

export default function Enter() {
  return (
    <div>
      <Head>
        <title>ft_transcendence</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div>
        <Link href="Home">
          <img src="/images/Group.png" alt="enterImg" className="enterImg" />
        </Link>
        <style jsx>{`
          div {
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .enterImg {
            height: 150px;
          }
        `}</style>
      </div>
    </div>
  );
}
