import Head from "next/head"
import { QuickSeo } from "next-quick-seo"
import Layout from "../components/Layout"
import { kayakTracker } from "../../content/localPosts"

export default function KayakTracker() {
  return (
    <Layout>
      <QuickSeo
        title={kayakTracker.title}
        description={kayakTracker.description}
        image={`https://www.larskarbo.no${kayakTracker.image}`}
      />
      <Head>
        <link rel="canonical" href="https://www.larskarbo.no/kayak-tracker" />
      </Head>
      <article>
        <header className="mb-8">
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Karbo Labs · 2026 · Field trials
          </p>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl leading-tight text-gray-800 dark:text-gray-200">
            {kayakTracker.title}
          </h1>
        </header>
        <div className="prose dark:prose-invert prose-base md:prose-lg max-w-none">
          <p>
            I designed and deployed a cellular GPS tracking system for a kayak
            rental operator in Norway. Four prototypes are in field testing,
            with custom firmware, remote updates, and a live fleet dashboard.
          </p>
          <div className="not-prose grid grid-cols-2 gap-4 my-8">
            <figure>
              <img
                src="/images/kayak-tracker/on-kayak.jpg"
                alt="Karbo Labs tracker mounted beneath the deck rigging of a rental kayak"
                width={768}
                height={1024}
                className="w-full aspect-[4/5] object-cover object-bottom rounded"
              />
              <figcaption className="mt-2 text-xs text-gray-500">
                Field prototype on a rental kayak.
              </figcaption>
            </figure>
            <figure>
              <img
                src="/images/kayak-tracker/power-testing.jpg"
                alt="Makerdiary prototype connected to a Nordic PPK2 for power measurements"
                width={665}
                height={1182}
                className="w-full aspect-[4/5] object-cover rounded"
              />
              <figcaption className="mt-2 text-xs text-gray-500">
                Power measurements on the Makerdiary variant.
              </figcaption>
            </figure>
          </div>
          <p>
            My work spans hardware integration and enclosure design, Zephyr/C
            firmware on the nRF9151, cellular telemetry, OTA releases, and the
            backend and map interface. The devices use GNSS for position and an
            accelerometer for motion-triggered wakeup and orientation reporting.
          </p>
          <p>
            Power consumption is the main constraint: the target is a six-month
            rental season on a 10 Ah battery. On the Feather variant, I measured
            <strong> 4.4 µA in System OFF and 5.5 µA between reports</strong>.
            GNSS acquisition and cellular transmission dominate the remaining
            budget. Full-season endurance is pending field validation.
          </p>
          <p>
            I built a robotic motion jig and combined it with PPK2 measurements
            and remote firmware updates to automate physical testing. This gave
            AI-assisted firmware iterations a measurable feedback loop on the
            device: change the code, exercise the hardware, measure current
            draw.
          </p>
          <figure>
            <iframe
              src="https://www.instagram.com/p/DcWAubENVy7/embed/"
              title="Kayak tracker robotic testing jig — Lars Karbo on Instagram"
              width="400"
              height="600"
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="mx-auto w-full max-w-md rounded-lg border border-gray-200"
            />
            <figcaption>
              The testing setup.{" "}
              <a href="https://www.instagram.com/p/DcWAubENVy7/">
                Watch on Instagram
              </a>
              .
            </figcaption>
          </figure>
          <p>
            Field telemetry exposed false inactivity decisions during smooth
            kayak movement and LTE outages after repeated modem reconnections. I
            adjusted motion thresholds and changed the modem lifecycle to retain
            registration with power-saving mode, then deployed the firmware
            remotely.
          </p>
          <p>
            The current hardware uses development boards in waterproof
            enclosures with 3D-printed shells. Field validation, charging
            access, and mounting are the next steps; capsize detection remains
            experimental.
          </p>
        </div>
      </article>
    </Layout>
  )
}
