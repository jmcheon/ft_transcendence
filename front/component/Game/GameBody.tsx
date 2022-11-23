import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/LayoutBox.module.css";
import Loading from "../errorAndLoading/Loading";
import useSocket from "../Utils/socket";
import GameReadyModal from "./GameBody/GameReadyModal";
import GameSettingModal from "./GameBody/GameSettingModal";

export default function GameBody({ accessToken }: { accessToken: string }) {
  const [waitModal, setWaitModal] = useState(false);
  const [settingModal, setSettingModal] = useState(false);
  const [ballSpeed, setBallSpeed] = useState<number>(0);
  const [ballSize, setBallsize] = useState<number>(0);
  const [socket, disconnet] = useSocket(accessToken, "game");
  const router = useRouter();

  const onClickWaitModal = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setWaitModal((curr) => !curr);
    },
    []
  );

  const onClickCancle = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setWaitModal((curr) => !curr);
    // Router.push("/Game/1");
  }, []);

  const closeSettingModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSettingModal((curr) => !curr);
    setWaitModal((curr) => !curr);
    //지금은 setTimeout 때문에 계속 바뀜
    router.push("/Home");
  };

  /**
   * socket.on('ready', ()=> {
   *   setSettingModal(true);
   * })
   */
  // 큐 찾아서 들어가는 시간
  // 나중에는 소켓 on으로 큐에 들어가게되면 setSettingModal 을 바꿔주면된다.
  setTimeout(() => {
    setSettingModal(true);
  }, 2000);
  /**
   *
   */

  if (socket) {
    socket.on("connect", () => {
      console.log("game body with connect event", socket.id);
    });
    console.log("game body", socket.id);
  }
  if (!socket) return <Loading />;
  return (
    <div className={styles.box}>
      {!waitModal && !settingModal && (
        <img
          onClick={onClickWaitModal}
          className="img-vector"
          src="/images/Vector.png"
          width={300}
          height={90}
        />
      )}
      {waitModal && !settingModal && (
        <div>
          <div onClick={onClickCancle} className="ring">
            Loading
          </div>
        </div>
      )}
      {/* 내가 오너일때 */}
      {/* {settingModal && (
        <div className="modal-background">
          <GameSettingModal
            accessToken={accessToken}
            closeSettingModal={closeSettingModal}
          />
        </div>
      )} */}
      {settingModal && (
        <div className="modal-background">
          <GameReadyModal
            accessToken={accessToken}
            closeSettingModal={closeSettingModal}
          />
        </div>
      )}
      <style jsx>{`
        .modal-background {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.8);
        }
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: visible;
        }

        .ring {
          position: relative;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 150px;
          height: 150px;
          background: transparent;
          border: 3px solid #3c3c3c;
          border-radius: 50%;
          text-align: center;
          line-height: 150px;
          font-family: sans-serif;
          font-size: 20px;
          color: black;
          letter-spacing: 4px;
          text-transform: uppercase;
          text-shadow: 0 0 10px white;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        .ring:before {
          content: "";
          position: absolute;
          top: -3px;
          left: -3px;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top: 3px solid white;
          border-right: 3px solid white;
          border-radius: 50%;
          animation: animateC 2s linear infinite;
        }
        span {
          display: block;
          position: absolute;
          top: calc(50% - 2px);
          left: 50%;
          width: 50%;
          height: 4px;
          background: transparent;
          transform-origin: left;
          animation: animate 2s linear infinite;
        }
        span:before {
          content: "";
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff000;
          top: -6px;
          right: -8px;
          box-shadow: 0 0 20px #fff000;
        }
        @keyframes animateC {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes animate {
          0% {
            transform: rotate(45deg);
          }
          100% {
            transform: rotate(405deg);
          }
        }
      `}</style>
    </div>
  );
}

//   const [leftPaddle, setLeftPaddle] = useState<number>(50);
//   const [myScore, setMySore] = useState<number>(0);
//   const [otherSideScore, setOtherSideSore] = useState<number>(0);

//   const onChangeftPaddle = (e: KeyboardEvent) => {
//     const key = e.key;
//     if (key === "w" || key === "s") {
//       if (!(leftPaddle > 0 && leftPaddle < 100)) return;
//       if (key === "w") {
//         setLeftPaddle((curr) => curr - 0.8);
//       } else {
//         setLeftPaddle((curr) => curr + 0.8);
//       }
//     }
//   };

//   // serverside!!!!!!!!!!!
//   /**
//    * x 2 ~ 94
//    *
//    * y = 0 ~ 97
//    */

//   interface XYType {
//     x: number;
//     y: number;
//   }

//   // ball x
//   // const ballX = useRef<number>(50);
//   // const ballY = useRef<number>(50);
//   const ball = useRef<XYType>({
//     x: 50,
//     y: 50,
//   });
//   // ball speed
//   const [ballSpeed, setBallSpeed] = useState<number>(250);
//   // 상대편 플레이어
//   const [rightPaddle, setRightPaddle] = useState<number>(50);
//   // ball movement

//   const ballDirection = useRef<XYType>({
//     x: 1,
//     y: 1,
//   });

//   const ballMovement = () => {
//     if (
//       ball.current.x <= 2 ||
//       ball.current.x >= 94 ||
//       ball.current.y <= 0 ||
//       ball.current.y >= 97
//     ) {
//       if (ball.current.x <= 2) {
//         // ballDirectionX.current *= -1;
//         ballDirection.current.x *= -1;
//         ball.current.x += 1;
//         // ball.current.x = 50;
//         // ball.current.x = 50;
//       }
//       if (ball.current.x >= 94) {
//         ballDirection.current.x *= -1;
//         ball.current.x -= 1;
//         // ball.current.x = 50;
//         // ball.current.x = 50;
//       }
//       if (ball.current.y <= 0) {
//         ballDirection.current.y *= -1;
//         ball.current.y += 1;
//       }
//       if (ball.current.y >= 97) {
//         ballDirection.current.y *= -1;
//         ball.current.y -= 1;
//       }
//     }
//     // setBallDirection((curr) => curr * -1);
//     ball.current.x += ballDirection.current.x * 0.075;
//     ball.current.y += ballDirection.current.y * 0.05;
//   };

//   console.log(ball.current.x);
//   console.log(ball.current.y);

//   useEffect(() => {
//     window.addEventListener("keydown", onChangeftPaddle);
//   }, []);

//   const [rerender, setRerender] = useState(0);

//   useEffect(() => {
//     setInterval(() => {
//       ballMovement();
//       setRerender((curr) => curr + 1);
//     }, 5);
//   }, []);

//   // setInterval(() => {
//   //   // ballMovement();
//   //   console.log("ha");
//   // }, 1500);
//   // setRerender((curr) => curr + 1);
//   return (
//     <div className="gameBoard">
//       <div className="score">
//         <div className="score">{myScore}</div>
//         <div className="score">{otherSideScore}</div>
//       </div>
//       <div className="ball"></div>
//       <div className="paddle left"></div>
//       <div className="paddle right"></div>
//       <style jsx global>{`
//         *,
//         *::after,
//         *::before {
//           box-sizing: border-box;
//         }

//         :root {
//           --hue: 200;
//           --saturation: 0%;
//           --foreground-color: hsl(var(--hue), var(--saturation), 75%);
//           --background-color: hsl(var(--hue), var(--saturation), 20%);
//         }

//         .gameBoard {
//           padding: 10px;
//           background-color: var(--background-color);
//         }

//         .paddle {
//           position: absolute;
//           background-color: var(--foreground-color);
//           width: 1vh;
//           top: calc(var(--position) * 1vh);
//           height: 10vh;
//           trasform: traslate(-50%);
//         }

//         .left {
//           --position: ${leftPaddle};
//           left: 1vw;
//         }

//         .right {
//           --position: ${rightPaddle};
//           right: 1vw;
//         }

//         .score {
//           display: flex;
//           justify-content: center;
//           font-weight: bold;
//           font-size: 7vh;
//           color: var(--foregroud-color);
//         }

//         .score > * {
//           flex-grow: 1;
//           flex-basis: 0;
//         }

//         .ball {
//           --x: ${ball.current.x};
//           --y: ${ball.current.y};

//           position: absolute;
//           background-color: var(--foreground-color);
//           left: calc(var(--x) * 1vw);
//           top: calc(var(--y) * 1vh);
//           trasform: traslate(-50%, -50%);
//           border-radius: 50%;
//           width: 2.5vh;
//           height: 2.5vh;
//         }
//       `}</style>
//     </div>
//   );
// }
