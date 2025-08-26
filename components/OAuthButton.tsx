import GoogleIcon from "./GoogleIcon";

// ---------- OAuth Button ----------
export default function OAuthButton({
  provider = "google",
  onClick,
}: {
  provider?: string;
  onClick?: () => void;
}) {
  if (provider === "google") {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => alert("Continue with Google — OAuth flow (demo)")}
          className="w-full inline-flex items-center justify-center gap-3 rounded-md border px-4 py-2 bg-white hover:shadow-sm"
          aria-label="Continue with Google"
        >
          {/* colored Google icon (keeps real Google colors) */}
          <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" aria-hidden>
            <path
              fill="#4285F4"
              d="M533.5 278.4c0-17.8-1.6-35-4.8-51.6H272v97.8h147.1c-6.4 34.6-25.4 63.9-54.1 83.5v69.2h87.4c51.2-47.1 80.1-116.6 80.1-199z"
            />
            <path
              fill="#34A853"
              d="M272 544.3c73.5 0 135.3-24.3 180.4-66.1l-87.4-69.2c-24.3 16.3-55.4 25.9-93 25.9-71.4 0-132-48.2-153.6-113.1H29.9v70.9C75.4 484.7 167.3 544.3 272 544.3z"
            />
            <path
              fill="#FBBC05"
              d="M118.4 323.8c-10.8-32.6-10.8-67.9 0-100.5V152.4H29.9c-38.4 76.7-38.4 167.8 0 244.5l88.5-73.1z"
            />
            <path
              fill="#EA4335"
              d="M272 109.7c39 0 74 13.4 101.6 39.7l76.1-76.1C408.3 24.6 346.5 0 272 0 167.3 0 75.4 59.6 29.9 152.4l88.5 70.9C140 157.9 200.6 109.7 272 109.7z"
            />
          </svg>
          <span className="text-sm font-medium">Continue with Google</span>
        </button>

        <p className="text-xs text-center text-gray-400">
          We’ll never post anything without your permission.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full inline-flex items-center justify-center gap-3 border rounded-md px-4 py-2"
    >
      <span>Continue with {provider}</span>
    </button>
  );
}
