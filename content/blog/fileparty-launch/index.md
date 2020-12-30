---
title: "Launching FileParty (Startup #2)"
author: Lars Karbo
date: 
excerpt: 
# hero: ./launches.jpeg
tags: []
---

This is the second startup I launched in my [12 startups in 12 months](/12-startups-12-months/) project.

## TLDR;

I just launched [FileParty](https://fileparty.co/) on Product Hunt. It is a real time file sharing service I hacked together.

**Launch stats:**

⏳ Time spent: 3 weeks

⬆️ Upvotes on ProductHunt: 192

👀 Visitors: 635

🔗 Boards created: 1073

💰 Revenue (donations): 0$

Had some insecurities about building this, and was very tired of it in the end. More about that in the story.

## How FileParty was born

It was December, and I had just finished my previous product, Slapper. I even got some traction with that, but had to go on. I had to go on because of the project I have started. I'm doing 12 startups in 12 months. This was my second project, but in the beginning of December I was a bit unsure on what to do. For the first time in my life I was unsure. Never thought this would happen.

Before I quit my full-time job I always had multiple side projects -- too little time and too many ideas. An important part of my identity, and that was also what I told people all the time. But now I found myself in this weird situation where I wasn't sure on what to do next. I quit my job for this, and now I wasn't sure what to do.

I took some time off, wandered around. Made a routine to write down my ideas. A week passed, I had some different ideas. 

Then I read something about WebRTC. The web API that makes it possible to do video calls in the browser. After some more research I figured out that this is all p2p. Meaning it goes directly from one computer to another. Just like torrent technology, you know, like we had on The Pirate Bay. I also figured out there were some people creating WebTorrent, a library based on WebRTC, that makes it possible to share any file between computers. All in the browser.

I started thinking there could be something for me here.

Then I thought of the concept that later became FileParty. What about a high-quality replacement for screensharing? Where you share the actual video file instead of sharing a recording of your screen. I thought this could be valuable for presenters and teachers in the remote world. If you want to show a video or audio file over Zoom today, it sounds terrible. I also realized it was good for friends wanting to watch a video file together.

Ok, so I had an idea for a product. Time had passed so much, I was already 10 days into the month, so I felt the need to start.

This idea was definetely "cool tech" more than it was "something the market needed". I got interested in the tech, and made up a possible market need after. People say this approach is stupid, and you should identify user problems and then find a suitable solution. I get that. But I don't want to listen to it. I think there are multiple ways to make a successful project. Sometimes you might need to tinker with the technology, experiment with things, trust your intuition before you find something that works in the market.

Also, in my situation, choosing something to build was better than doing nothing. At least I would increase my chance of serendipitous encounters and observations by doing it.

## Building FileParty

The unique parts of FileParty is the p2p technology. WebRTC enables this in the browser, but there is still a lot of work needed to make it work reliably. The core of it is that you need to discover the other clients. So you need a server where clients can register and find which other clients to connect to. After trying to do this manually for a while, I figured out that the WebTorrent library and tooling around it makes it easier to set up. Kudos to @ferros and all the useful packages he has created in that ecosystem.

Just like Slapper, FileParty is a program full of bugs. There were bugs during development and there are bugs now. A lot of it comes from the fact that both apps are complex in nature, needing synchronization and relying on unstable external functions. But another part of it is that I need to be better at writing quality code. Need to be better at taking a step back and refactoring. Drawing system arcitecture on a piece of paper. Speed is important in the dev world, but if you never focus on the craft of quality code, you will never be fast.

## Launching FileParty

As usual before launch, I get this feeling of disgust over the project. Can't stand it anymore. Just want it to be gone, over. I have seen this in real life too. People get tired of a 5-year college degree right before it ends the same way people get tired of a 1-year college degree right before it ends. I don't know the psychological reasons for this, but I think it's worth being aware of. There is definetely some insecurity. "Is this thing even useful?". "It doesn't work anyways". Maybe it's my mind trying to protect me from the irrational dangers of putting my work out there.

I launched FileParty on Product Hunt, wrote the [twitter] post, sent a note to on my [personal newsletter].

The takeaways after 24 hours was:

⏳ Time spent: 3 weeks

⬆️ Upvotes on ProductHunt: 192

👀 Visitors: 635

🔗 Boards created: 1073

💰 Revenue (donations): 0$

I got more upvotes than ever before (#1, #2), but didn't get that much engagement, but I was happy with the 3-4 responses I got about the product. I don't really care about numbers of upvotes or likes. I care about people that tested the product and sent me a message about it.

## Some thoughts about instant feedback

I added a input field on the site where you could instantly send feedback. I wanted to minimize the barriers for communication. As an experiment, I hooked the box up to a Slack bot. This is how my inbox looked:

(slack inbox)

XX responses like "asdf", and "test". I mean, why do people write "test"? I don't get it. But it did open for at least two interesting discussions.

## An unexpected outcome

I got in touch with a head of product of an interesting new video communication platform. He was interested if it was possible to integrate FileParty in some way. This was exciting, and excactly the kind of serendipity launching and putting your work out there can give. I am going to meet with him next week, and will let you know how it progresses.

## Conclusion

Happy to be done with the second startup of my 12 startups project.

Not sure about the future of FileParty, but I will let the serendipity and unknown powers of the universe work a bit with it. Maybe I will get a realization after a while? Maybe I will meet the right person that leads FileParty the right way? In any way, I am happy I pushed my comfort zones and got it out there.

Launching muscle is getting stronger. Stay tuned for more launches and more insights.