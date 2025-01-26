import Link from "next/link";
import { Github, Globe, Linkedin, Mail, Twitter } from "lucide-react";

export default function LetsConnect() {
  return (
    <div className="p-20">
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <span role="img" aria-label="handshake" className="text-yellow-400">
            👋
          </span>
          Let&apos;s Connect
        </h2>

        <p className="text-muted-foreground">
          I&apos;m always eager to collaborate on exciting projects that push
          boundaries. Feel free to check out my repositories or reach out to me.
        </p>

        <ul className="space-y-3">
          <li>
            <Link
              href="https://naman-anand.com"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <Globe className="h-4 w-4" />
              Portfolio: naman-anand.com
            </Link>
          </li>

          <li>
            <Link
              href="mailto:iamnamananand996@gmail.com"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              Email: iamnamananand996@gmail.com
            </Link>
          </li>

          <li>
            <Link
              href="https://github.com/iamnamananand996"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <Github className="h-4 w-4" />
              GitHub: iamnamananand996
            </Link>
          </li>

          <li>
            <Link
              href="https://www.linkedin.com/in/naman-anand-033a39150/"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn: Naman Anand
            </Link>
          </li>

          <li>
            <Link
              href="https://twitter.com/@naman_ananddd"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <Twitter className="h-4 w-4" />
              Twitter: @naman_anandd
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
