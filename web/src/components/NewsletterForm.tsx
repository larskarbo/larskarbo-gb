export const NewsletterForm = () => {
  return (
    <div>
      <script async src="https://subscribe-forms.beehiiv.com/embed.js"></script>
      <iframe
        src="https://subscribe-forms.beehiiv.com/f1fdb67e-5850-4fb7-b539-7528f777ab34"
        className="beehiiv-embed"
        data-test-id="beehiiv-embed"
        frameBorder="0"
        scrolling="no"
        style={{
          width: "787px",
          height: "417px",
          margin: "0",
          borderRadius: "0px 0px 0px 0px !important",
          backgroundColor: "transparent",
          boxShadow: "0 0 #0000",
          maxWidth: "100%",
        }}
      ></iframe>
    </div>
  )
}
