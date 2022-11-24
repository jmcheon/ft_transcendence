import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { mutate } from "swr";

const ChangeNameModal = ({
  modal,
}: {
  modal: (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => void;
}) => {
  const [newNickName, setNewNickName] = useState<string>("");
  const router = useRouter();

  /**
   * useCallBack: newNickName이 변화함에 따라서 업데이트
   * input 값이 바뀔때마다, newNickName이 업데이트됨
   */
  const getNewNickName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewNickName(e.target.value.trim());
    },
    [newNickName]
  );

  /**
   * submit버튼을 누르면, useState로 관리되는 newNickName이
   * axios를 통해서, post요청을 함.
   * 글자수는 1 ~ 20
   * 마지막으로 newNickName을 리셋해주고
   * modal함수를 실행하여, modal을 닫고 Home으로 페이지 이동
   */
  const postNewName = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (newNickName.length >= 1 && newNickName.length <= 20) {
        try {
          await axios.post("/api/setting/username?", {
            username: newNickName,
          });
          mutate("/api/users");
        } catch (err) {
          console.log(err);
        } finally {
          router.push("/Home");
        }
      } else {
        alert("new nickname should be 1 ~ 20 characters");
        modal(e);
      }
    },
    [newNickName]
  );

  return (
    <div className="box">
      <div className="title">
        <h2>Change Name</h2>
      </div>
      <form className="createForm" method="post">
        <div className="submitform">
          <div>
            <input
              onChange={getNewNickName}
              type="text"
              placeholder="new nickname should be less then 10 characters"
            />
          </div>
        </div>
        <div className="buttonDiv">
          <button onClick={postNewName} className="ok">
            Submit
          </button>
          <button onClick={modal} className="cancel">
            Cancel
          </button>
        </div>
      </form>
      <style jsx>{`
        .box {
          font-family: "Fragment Mono", monospace;
          position: fixed;
          top: 30%;
          left: 33%;

          width: 500px;
          height: 300px;

          background-color: white;
          border: 1px inset black;
          // box-shadow: 10px 10px;
          text-transform: uppercase;
        }
        .title {
          background-color: black;
          color: white;
          // height: 100%;
        }
        .submitform {
          // background-color: yellow;
          // padding-left: 50px;
          padding-top: 60px;
        }
        input {
          // background-color: tomato;
          font-family: "Fragment Mono", monospace;
          width: 400px;
          height: 30px;
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 2px solid black;
          outline: none;
          margin-bottom: 20px;
        }
        input::placeholder {
          text-align: center;
          color: red;
        }
        button {
          text-align: center;
          padding-top: 20px;
        }
        .buttonDiv {
          // background-color: yellow;
          margin-top: 10px;
        }
        .ok {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          color: white;
          background-color: black;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
        }
        .cancel {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ChangeNameModal;
