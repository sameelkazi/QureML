import {
  Logo01,
  Logo02,
  Logo03,
  Logo04,
  Logo05,
  Logo06,
  Logo07,
  Logo08,
} from "@/components/ui/logo-cloud-09-utils/logos";

const LogoCloud = () => {
  return (
    <div className="px-6 py-12">
      <p className="text-balance text-center font-medium text-foreground/80 text-lg">
        Powered by Enterprise Hybrid Quantum & Clinical ML Infrastructure
      </p>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 place-items-center gap-x-4 gap-y-4 grayscale-100 transition-all duration-300 hover:grayscale-0 sm:grid-cols-3 md:grid-cols-4">
        <div className="flex w-full items-center justify-center rounded-xl bg-muted px-3 py-7 transition-all duration-200 hover:bg-muted/80 hover:shadow-md">
          <Logo01 className="h-7 sm:h-8" />
        </div>
        <div className="flex w-full items-center justify-center rounded-xl bg-muted px-3 py-7 transition-all duration-200 hover:bg-muted/80 hover:shadow-md">
          <Logo02 className="h-7 sm:h-8" />
        </div>
        <div className="flex w-full items-center justify-center rounded-xl bg-muted px-3 py-7 transition-all duration-200 hover:bg-muted/80 hover:shadow-md">
          <Logo03 className="h-7 sm:h-8" />
        </div>
        <div className="flex w-full items-center justify-center rounded-xl bg-muted px-3 py-7 transition-all duration-200 hover:bg-muted/80 hover:shadow-md">
          <Logo04 className="h-7 sm:h-8" />
        </div>
        <div className="flex w-full items-center justify-center rounded-xl bg-muted px-3 py-7 transition-all duration-200 hover:bg-muted/80 hover:shadow-md">
          <Logo05 className="h-7 sm:h-8" />
        </div>
        <div className="flex w-full items-center justify-center rounded-xl bg-muted px-3 py-7 transition-all duration-200 hover:bg-muted/80 hover:shadow-md">
          <Logo06 className="h-7 sm:h-8" />
        </div>
        <div className="flex w-full items-center justify-center rounded-xl bg-muted px-3 py-7 transition-all duration-200 hover:bg-muted/80 hover:shadow-md">
          <Logo07 className="h-7 sm:h-8" />
        </div>
        <div className="flex w-full items-center justify-center rounded-xl bg-muted px-3 py-7 transition-all duration-200 hover:bg-muted/80 hover:shadow-md">
          <Logo08 className="h-7 sm:h-8" />
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
