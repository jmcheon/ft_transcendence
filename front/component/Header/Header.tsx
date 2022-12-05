import { TypeChatId } from "../../interfaceType";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import styles from "styles/Gnb.module.css";
import SearchBar from "./SearchBar";
import axios from "axios";
import { mutate } from "swr";

export default function Header({ id }: { id: TypeChatId | undefined }) {
  const router = useRouter();
  const onClickImg42 = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/");
  }, []);

  useEffect(() => {
    return () => {
      if (id) {
        console.log(id.id, id.link);
        console.log("이동");
        mutate(`/api/${id.link}/${id.id}/members`);
        console.log(`/api/${id.link}/${id.id}/members`);
      }
    };
  }, [id?.id]);

  return (
    <div className="header">
      <nav className={styles.navbar}>
        <img
          onClick={onClickImg42}
          src="/images/42Logo.png"
          alt="42logo"
          className={styles.logo}
        />
        <ul className={styles.navbar_menu}>
          <li>
            <Link href="/Home" legacyBehavior>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/Chat" legacyBehavior>
              <a>Chat</a>
            </Link>
          </li>
          <li>
            <Link href="/Game" legacyBehavior>
              <a>Game</a>
            </Link>
          </li>
          <li>
            <Link href="/Setting" legacyBehavior>
              <a>Setting</a>
            </Link>
          </li>
        </ul>
        {/* <form className={styles.search}>
              <input type="text" placeholder="Search"></input>
            </form> */}
      </nav>
      <SearchBar />
      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        img {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
