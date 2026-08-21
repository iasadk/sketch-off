import FormRenderer from "./components/FormRenderer";
import Logo from "./components/Logo";

export default function Home() {
  return (
    <div
      className="h-screen w-full"
      >
      <div className="flex justify-center my-8">
        <Logo />
      </div>
      <FormRenderer/>
    </div>
  );
}
