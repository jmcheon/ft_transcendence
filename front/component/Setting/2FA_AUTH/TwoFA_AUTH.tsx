import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import Error from "../../errorAndLoading/Error";
import Loading from "../../errorAndLoading/Loading";
import fetcher from "../../Utils/fetcher";
import TwoFactor from "../TwoFactor";

const TwoFA_AUTH = ({
  modal,
}: {
  modal: (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => void;
}) => {
  const router = useRouter();
  const { data, error, isValidating } = useSWR("/api/users", fetcher);
  //   console.log(data);
  // state필요없고, get으로 데이터 넣고, post로 업데이트해야한다.
  // const [twoFactor, settwoFactor] = useState(false);
  const [codeFromQRCode, setCodeFromQRCode] = useState<string>("");

  const onChangeCode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCodeFromQRCode(e.target.value);
    // console.log(e.target.value);
  }, []);

  // console.log(data.two_factor);
  const onClick2FA = useCallback(
    async (
      e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
      e?.stopPropagation();
      e?.preventDefault();
      if (data) {
        if (!data.two_factor_activated && codeFromQRCode) {
          await axios
            .post("/api/two-factor/activate", {
              set: true,
              two_factor_code: codeFromQRCode,
            })
            .then(() => {
              setCodeFromQRCode("");
              // settwoFactor(true);
              mutate("/api/users");
              router.push("/Home");
            })
            .catch((err) => {
              console.log(err);
              alert("Wrong code");
            });
        } else if (data.two_factor_activated) {
          await axios
            .post("/api/two-factor/deactivate", {
              set: false,
            })
            .then(() => {
              setCodeFromQRCode("");
              // settwoFactor(false);
              mutate("/api/users");
              router.push("/Home");
            })
            .catch((err) => console.log(err));
        }
      }
    },
    []
  );

  // console.log(data.two_factor_activated);
  if (error) return <Error />;
  if (!data) return <Loading />;
  return (
    <div className="box">
      <div className="title">
        <h2>Change Name</h2>
      </div>
      <form className="createForm" method="post">
        <div className="submitform">
          {data.two_factor_activated === true ? (
            <div className="activated">
              <img src="/favicon.ico" width={70} height={70} />
              <div className="is-active">ACTIVATED</div>
            </div>
          ) : (
            <div>
              <img alt={data} src={"/api/two-factor/generate"} />
              <input
                onChange={onChangeCode}
                placeholder="Code please"
                type={"text"}
              />
            </div>
          )}
        </div>
        <div className="buttonDiv">
          <button onClick={onClick2FA} className="ok">
            {data.two_factor_activated === false ? "ACTIVATE" : "DEACTIVATE"}
          </button>
          <button onClick={modal} className="cancel">
            Cancel
          </button>
        </div>
      </form>
      <style jsx>{`
        .activated {
          padding-top: 50px;
          width: 200px;
          height: 180px;
        }
        .buttonDiv {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .is-active {
          color: black;
          font-family: "Doppio One";
          font-style: normal;
          font-weight: 400;
          font-size: 30px;
          line-height: 20px;
          overflow: visible;
          margin: 5px;
        }
        .box {
          font-family: "Fragment Mono", monospace;
          position: fixed;
          top: 30%;
          left: 33%;

          width: 500px;
          height: 550px;

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
          margin: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
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
          margin-bottom: 10px;
        }
        .cancel {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default TwoFA_AUTH;
