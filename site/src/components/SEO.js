import { useEffect, useState } from "react";

export default function SEO({
  title,
  description,
  url,
  image = "/imgs/bounties-twitter.jpg",
  twitter = { cardType: "summary_large_card" },
}) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const [hasHeadDescription, setHasHeadDescription] = useState(false);
  useEffect(() => {
    const headDescription = document.querySelector("meta[name=description]");
    if (headDescription) {
      setHasHeadDescription(true);
    }
    if (description) {
      headDescription.content = description;
    }
  }, [description]);

  return (
    <>
      {!hasHeadDescription && description && (
        <meta name="description" content={description} />
      )}
      {url && <meta name="og:url" content={url} />}
      {image && (
        <>
          <meta name="og:image" content={image} />
          <meta name="twitter:image" content={image} />
        </>
      )}
      {twitter?.cardType && (
        <meta
          name="twitter:card"
          key="twitter:card"
          content={twitter.cardType}
        />
      )}
    </>
  );
}
