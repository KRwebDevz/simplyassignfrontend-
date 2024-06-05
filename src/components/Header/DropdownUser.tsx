import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const role =localStorage.getItem("role");
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/signin";
  };
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          {/* <span className="block text-sm font-medium text-black dark:text-white">
            Thomas Anree
          </span> */}

        </span>

        <span className="h-12 w-12 rounded-full">
          <img
            width={112}
            height={112}
            src={"data:image/jpeg;base64,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"}
            style={{
              width: "auto",
              height: "auto",
            }}
            alt="User"
            className="rounded-full"
          />
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">

        <li>
            <Link
              href="/"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
               <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                            fill=""
                          />
                        </svg>
              Dashboard
            </Link>
          </li>


        { role === "principle" && (
          <li>
            <Link
              href="/manage"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-users-group"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" /><path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M17 10h2a2 2 0 0 1 2 2v1" /><path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M3 13v-1a2 2 0 0 1 2 -2h2" /></svg>

              Manage
            </Link>
          </li>
          )}
          


          <li>
            <Link
              href="/settings"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <svg
                className="fill-current"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z"
                  fill=""
                />
                <path
                  d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.10935 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0094 20.8312 18.4594 21.4156 17.7719 21.4156ZM4.53748 19.8687H17.4969V17.0844C17.4969 14.575 15.4344 12.5125 12.925 12.5125H9.07498C6.5656 12.5125 4.5031 14.575 4.5031 17.0844V19.8687H4.53748Z"
                  fill=""
                />
              </svg>
              My Profile
            </Link>
          </li>
         
         
        </ul>


     


        <button className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base" onClick={handleLogout}>
          <svg
            className="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
              fill=""
            />
            <path
              d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
              fill=""
            />
          </svg>
          Log Out
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;
