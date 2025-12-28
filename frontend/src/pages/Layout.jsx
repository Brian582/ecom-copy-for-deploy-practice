import NavBar from "../components/Navbar";

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