import { Link } from "react-router-dom";

const NavLinks = ({ createRipple, isMobile = false, onLinkClick }) => {
  const baseClass = isMobile
    ? "nav-link block px-3 py-3 text-gray-700 hover:bg-gray-50 text-base rounded-md transition"
    : "nav-link text-gray-700 font-normal text-base py-2 px-3 rounded-md transition duration-200 active:scale-95";

  return (
    <>
      <Link
        to="/"
        className={baseClass}
        onClick={e => {
          createRipple(e);
          onLinkClick && onLinkClick();
        }}
      >
        Home
      </Link>
      <Link
        to="/publications"
        className={baseClass}
        onClick={e => {
          createRipple(e);
          onLinkClick && onLinkClick();
        }}
      >
        Publications
      </Link>
      {/* <Link
        to="/members"
        className={baseClass}
        onClick={e => {
          createRipple(e);
          onLinkClick && onLinkClick();
        }}
      >
        Members
      </Link> */}
      <Link
        to="/videos"
        className={baseClass}
        onClick={e => {
          createRipple(e);
          onLinkClick && onLinkClick();
        }}
      >
        Videos
      </Link>
      {/* <Link
        to="/about"
        className={baseClass}
        onClick={e => {
          createRipple(e);
          onLinkClick && onLinkClick();
        }}
      >
        About
      </Link> */}
      {isMobile && (
        <>
          <Link
            to="/articles"
            className={baseClass}
            onClick={e => {
              createRipple(e);
              onLinkClick && onLinkClick();
            }}
          >
            Articles
          </Link>
          <Link
            to="/announcements"
            className={baseClass}
            onClick={e => {
              createRipple(e);
              onLinkClick && onLinkClick();
            }}
          >
            Announcements
          </Link>
        </>
      )}
    </>
  );
};

export default NavLinks;
