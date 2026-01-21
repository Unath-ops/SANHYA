interface IntroSlideProps {
  name: string;
}

export default function IntroSlide({ name }: IntroSlideProps) {
  return (
    <div className="h-full flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-serif mb-8 animate-fade-in-up">
          Hi {name}...
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 leading-relaxed animate-fade-in-up-delayed">
          We analyzed your year.
          <br />
          It's time to see the cost.
        </p>
      </div>
    </div>
  );
}
