import CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";

export const CookieConsentBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="dobeuCookieConsent"
      style={{
        background: "hsl(var(--card))",
        boxShadow: "var(--shadow-xl)",
        padding: "1.5rem",
        alignItems: "center",
      }}
      buttonStyle={{
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        fontSize: "14px",
        padding: "0.75rem 1.5rem",
        borderRadius: "0.5rem",
        fontWeight: "600",
        border: "none",
        cursor: "pointer",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "hsl(var(--foreground))",
        fontSize: "14px",
        padding: "0.75rem 1.5rem",
        borderRadius: "0.5rem",
        fontWeight: "600",
        border: "1px solid hsl(var(--border))",
        cursor: "pointer",
      }}
      expires={365}
      onAccept={() => {
        console.log("Cookies accepted");
      }}
      onDecline={() => {
        console.log("Cookies declined");
      }}
    >
      <div className="text-foreground">
        <p className="text-sm mb-2">
          We use cookies to enhance your experience, analyze site traffic, and
          personalize content. We may sell your data to third parties for
          marketing and advertising purposes.
        </p>
        <div className="flex flex-wrap gap-4 text-xs">
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
          <Link
            to="/ccpa-optout"
            className="text-primary hover:underline font-semibold"
          >
            Do Not Sell My Data
          </Link>
        </div>
      </div>
    </CookieConsent>
  );
};
