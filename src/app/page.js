/* eslint-disable @next/next/no-img-element */
import { LuLock, LuShieldCheck, LuKeyRound } from "react-icons/lu";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white antialiased font-inter">
      <Hero />
      <Features />
      <Security />
    </div>
  );
}

// --- Hero Component ---
function Hero() {
  return (
    <div className="relative isolate bg-white min-h-[calc(100vh-56px)]">
      {/* Background Gradient */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#80ffdb] to-[#007BFF] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Digital Life, <span className="text-blue-500">Secured</span>.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Stop worrying about passwords. SecureNest gives you a secure and
              easy way to store, check, and generate strong, unique passwords
              for every account.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/"
                className="rounded-md bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-all transform hover:scale-105"
              >
                Get Started for Free
              </Link>
              <Link
                href="/"
                className="text-sm font-semibold leading-6 border px-5 py-2 rounded-xl text-gray-900 group"
              >
                Learn more{" "}
                <span
                  aria-hidden="true"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Features Component ---
function Features() {
  const features = [
    {
      name: "Secure Password Vault",
      description:
        "Easily save and organize all your passwords. Access them from anywhere, on any device, with one master password.",
      icon: LuLock,
      imageUrl:
        "/images/home/secure-vault.svg",
    },
    {
      name: "Password Strength Checker",
      description:
        "Audit your existing passwords for weaknesses. Our tool identifies reused, weak, or compromised passwords.",
      icon: LuShieldCheck,
      imageUrl:
        "/images/home/strength-meter.svg",
    },
    {
      name: "Strong Password Generator",
      description:
        'Create complex, unique, and random passwords for every new account with a single click. No more using "password123".',
      icon: LuKeyRound,
      imageUrl:
        "/images/home/password-generator.svg",
    },
  ];

  return (
    <div className="bg-white min-h-[calc(100vh-56px)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-500">
            Everything You Need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            A Complete Password Solution
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            From storage to generation, SecureNest provides the tools you need
            to keep your digital identity safe.
          </p>
        </div>
        <div className="mt-16 max-w-2xl mx-auto sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col border border-gray-200/50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
                <img
                  src={feature.imageUrl}
                  alt={`${feature.name} illustration`}
                  className="mt-6 rounded-lg w-full h-auto aspect-video object-cover"
                />
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

// --- Security Section ---
function Security() {
  return (
    <div className="relative bg-gray-50 overflow-hidden min-h-[calc(100vh-56px)] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10 items-center">
          <div>
            <h2 className="text-base font-semibold leading-7 text-blue-500">
              Zero-Knowledge Encryption
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Security You Can Trust
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We use end-to-end, zero-knowledge encryption (Crypto) to protect
              your data. Only you can access your vault. We can&apos;t see your
              passwords, and neither can anyone else.
            </p>
            <ul className="mt-8 space-y-4 text-gray-600">
              <li className="flex gap-x-3">
                <LuShieldCheck
                  className="mt-1 h-5 w-5 flex-none text-blue-500"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-gray-900">
                    End-to-End Encryption:
                  </strong>{" "}
                  Your data is encrypted and decrypted on your device.
                </span>
              </li>
              <li className="flex gap-x-3">
                <LuLock
                  className="mt-1 h-5 w-5 flex-none text-blue-500"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-gray-900">
                    One Master Password:
                  </strong>{" "}
                  Your vault is secured by a master password only you know.
                </span>
              </li>
              <li className="flex gap-x-3">
                <LuShieldCheck
                  className="mt-1 h-5 w-5 flex-none text-blue-500"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-gray-900">
                    Regular Security Audits:
                  </strong>{" "}
                  We continuously test our systems to ensure your data is safe.
                </span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center items-center">
            <img
              src="/images/home/encryption.svg"
              alt="Security shield"
              className="rounded-2xl shadow-xl w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
