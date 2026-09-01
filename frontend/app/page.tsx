import FormRenderer from "./components/FormRenderer";
import GithubButton from "./components/GithubButton";
import HomeLayout from "./components/Home";
import Logo from "./components/Logo";

export default function Home() {
  return (
    <div>
      <div className="relative w-full">
        <GithubButton href="https://github.com/iasadk/sketch-off" />
      </div>
      <HomeLayout>
        <FormRenderer />
      </HomeLayout>
    </div>
  );
}
