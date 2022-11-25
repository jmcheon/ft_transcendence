import ChatBody from "../component/Chat/ChatBody";
import Layout from "../component/Layout";
import Participant from "../component/Chat/Participant";
import RoomList from "../component/Chat/RoomList";
import Title from "../component/Title";
import cookies from "next-cookies";
import tokenManager from "../component/Utils/tokenManager";
import Loading from "../component/errorAndLoading/Loading";
import TwoFactorModal from "../component/Home/TwoFactorModal";
import useSWR from "swr";
import axios from "axios";
import { GetServerSideProps } from "next";

export default function Chat({ refreshToken }: { refreshToken: string }) {
  const { data, error } = useSWR("/api/users");

  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data) return <Loading />;
  return (
    <Layout>
      <Title title="Chat" />
      {data.two_factor_activated && !data.two_factor_valid && (
        <TwoFactorModal />
      )}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 4fr 2fr" }}>
        <RoomList />
        <ChatBody />
        <Participant />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = cookies(context);
  const { accessToken, refreshToken } = cookie;
  if (!accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  tokenManager(cookie);
  return { props: { refreshToken } };
};
