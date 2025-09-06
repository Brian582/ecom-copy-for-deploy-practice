import NavBar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <NavBar /> {/*this will show navigation bar in all other components */}
      <div>
        {children} {/* Render the content of other components */}
      </div>
    </>
  );
}