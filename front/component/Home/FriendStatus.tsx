import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import styles from "../../styles/LayoutBox.module.css";
import Loading from "../errorAndLoading/Loading";
import useSocket from "../Utils/socket";
import { EachFriend } from "./FriendStatus/EachFriend";

export default function FriendStatus({ id }: { id: string }) {
  const [chatSocket] = useSocket(null, "chat");
  const { data: friendListData, error: friendListError } = useSWR(
    `/api/users/friend/list`
  );

  useEffect(() => {
    chatSocket?.on("status", () => {
      mutate(`/api/users/friend/list`);
    });
    return () => {
      chatSocket?.off("status");
    };
  }, [friendListData, chatSocket?.id]);

  if (!friendListData || !chatSocket) return <Loading />;
  return (
    <div className={styles.box}>
      <h1>Friend Status</h1>
      <hr />
      <ul>
        {friendListData &&
          friendListData.map((eachFriend: any) => {
            const color = { color: "" };
            if (eachFriend.status === "Login") {
              color.color = "green";
            } else if (eachFriend.status === "Logout") {
              color.color = "red";
            } else if (eachFriend.status === "Game") {
              color.color = "yellow";
            }
            console.log(eachFriend);
            return (
              <div key={eachFriend.id}>
                <EachFriend
                  color={color.color}
                  friendUsername={eachFriend.friendUsername}
                  id={eachFriend.friendUserId}
                />
              </div>
            );
          })}
      </ul>
      <style jsx>{`
        h1 {
          font-family: "Fragment Mono", monospace;
          font-size: 25px;
          font-weight: bold;
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}
