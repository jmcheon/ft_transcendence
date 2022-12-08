import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Loading from "../../errorAndLoading/Loading";
import useSocket from "../../Utils/socket";
import { GameDTO } from "../../../interfaceType";
// 오너가 아니면, 일반 체크만 하는 페이지도 만들어야한다

const GameSettingModal = ({
  accessToken,
  closeSettingModal,
  username,
}: {
  accessToken: string;
  closeSettingModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
  username: string;
}) => {
  const router = useRouter();
  const [socket] = useSocket(accessToken, "game");
  const [speed, setSpeed] = useState<string>("50");
  const [ballSize, setBallSize] = useState<string>("50");
  const [roomName, setRoomName] = useState<string>("");
  const [roomList, setRoomList] = useState<string[]>([]);

  const onClickSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      if (!roomName) {
        alert("Room name please");
        return;
      }

      if (roomList.includes(roomName)) {
        alert("We have already same name of game");
        setRoomName("");
        return;
      }
      // 그리고 게임시작
      socket?.emit("startGame", {
        roomName,
        speed,
        ballSize,
      });

      console.log(
        `game room name : ${roomName}, ball size : ${ballSize}, ball speed : ${speed}`
      );

      setRoomName("");
    },
    [speed, ballSize, roomName]
  );

  const onChangeSpeed = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      setSpeed(e.target.value);
      console.log(speed);
    },
    [speed]
  );

  const onChangeBallSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      setBallSize(e.target.value);
    },
    [ballSize]
  );

  const onChangeRoomName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRoomName(e.target.value.trim());
      console.log(roomList);
    },
    [roomName]
  );

  useEffect((): (() => void) => {
    console.log("game setting owner modal", socket?.id);
    socket?.emit("room-list");
    socket?.on("room-list", (list) => {
      setRoomList(list);
    });
    // 완료된 소켓! 받은후에 이동
    socket?.on("enterGame", (roomName: string) => {
      socket?.emit("myname", username);
      console.log(roomName, " is room name from server event: enterGame");
      router.push({
        pathname: `/Game/${roomName}`,
        query: {
          myRole: "owner",
        },
      });
    });
    return () => {
      console.log("off socket in game setting modal");
      socket?.off("enterGame");
      socket?.off("room-list");
    };
  }, [socket?.id]);

  if (!socket) return <Loading />;
  return (
    <div className="box">
      <div className="title">
        <h2>Game setting</h2>
      </div>
      <form className="createForm" method="post">
        <div className="submitform">
          <div className="input-div-roomname">
            <p className="p-roomname">Room Name</p>
            <input
              onChange={onChangeRoomName}
              value={roomName}
              className="input-name"
              type="text"
              placeholder="more than 1 character needed"
            />
          </div>
          <div className="div-speedbar">
            <p>Speed</p>
            <input
              onChange={onChangeSpeed}
              value={speed}
              className="input-speedbar"
              type="range"
            />
          </div>
          <div className="div-ballsizebar">
            <p>Ball Size</p>
            <input
              onChange={onChangeBallSize}
              value={ballSize}
              className="input-ballsizebar"
              type="range"
            />
          </div>
        </div>
        <div className="buttonDiv">
          <button onClick={onClickSubmit} className="ready">
            Ready
          </button>
          <button onClick={closeSettingModal} className="cancel">
            Cancel
          </button>
        </div>
      </form>
      <style jsx>{`
        p {
          font-weight: bold;
        }
        .p-roomname {
          //   background-color: red;
          margin-right: 20px;
          margin-left: 30px;
        }
        .input-name {
          width: 320px;
          height: 30px;
          //   margin-top: 10px;
          border-top: none;
          border-left: none;
          border-right: none;
          outline: none;
          border-bottom: 2px solid black;
          text-align: center;
          font-size: 17px;
        }
        .input-div-roomname {
          //   background-color: red;
          margin-top: 5px;
          display: flex;
          //   height: 40px;
        }
        .submitform {
          display: grid;
          grid-template-rows: 1fr 1fr;
          margin-top: 20px;
          margin-bottom: 20px;
        }
        .box {
          font-family: "Fragment Mono", monospace;
          position: fixed;
          top: 30%;
          left: 33%;

          width: 500px;
          height: 330px;

          background-color: white;
          border: 1px inset black;
          text-transform: uppercase;
        }
        .title {
          text-align: center;
          background-color: black;
          color: white;
        }
        input::placeholder {
          font-size: 12px;
          color: red;
          font-family: "Fragment Mono", monospace;
          text-align: center;
        }

        .div-speedbar {
          display: flex;
          margin-left: 30px;
          //   margin-top: 5px;
        }

        .input-speedbar {
          width: 327px;
          margin-left: 57px;
        }
        .div-ballsizebar {
          //   margin-top: 5px;
          display: flex;
          margin-left: 30px;
        }

        .input-ballsizebar {
          width: 327px;
          margin-left: 20px;
        }

        button {
          text-align: center;
          padding-top: 20px;
        }
        .buttonDiv {
          display: flex;
          justify-content: center;
          margin-top: -5px;
        }
        .ready {
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
        input[type="range"] {
          //   width: 100%;
          -webkit-appearance: none;
          background: transparent;
        }
        input[type="range"]:focus {
          outline: none;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          //   width: 100%;
          //   height: 100%;
          cursor: pointer;
          //   border-radius: 5px;
          border: 1px solid black;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
          background: black;
          //   box-shadow: 1px 1px 7px gray;
          cursor: pointer;
          //   box-shadow: -100vw 0 0 100vw #ff96ab;
        }
      `}</style>
    </div>
  );
};

export default GameSettingModal;
