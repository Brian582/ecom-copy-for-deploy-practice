import NavBar from "../component/Navbar";

export default function Layout({ children }) {
  return (
    <>
      <NavBar /> {/*this will show in all other components */}
      <div>
        {children} {/* Render the content of other components */}
      </div>
    </>
  );
}