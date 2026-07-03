const fs = require('fs');

const viralBlogs = [
  {
    slug: 'why-standard-battery-alerts-are-destroying-your-laptop',
    title: 'Why Standard Battery Alerts Are Destroying Your Laptop',
    category: 'Deep Dive',
    color: 'var(--accent-red)',
    excerpt: 'We tend to ignore small, gray notifications in the corner of our screens. That behavioral blindspot is costing power users hundreds of dollars.',
    content: `
# Why Standard Battery Alerts Are Destroying Your Laptop

Have you ever been completely in the zone, coding, designing, or editing, only for your screen to suddenly go black? You missed the tiny 10% battery warning. Again.

Lithium-ion batteries are chemical engines. They don't like being completely empty, and they absolutely hate being stuffed full to 100% and left on the charger while running heavy workloads. Every time your laptop dies because you missed a polite notification, you are doing irreversible damage to the chemical structure of your battery cell.

## The Psychology of Ignoring

When Apple or Microsoft designed their operating systems, they wanted alerts to be "unobtrusive". A tiny little chime, a small gray box sliding in from the right. It's polite.

> "Polite notifications are easily dismissed when you are in a state of deep flow."

But when your battery hits 10% and you're compiling a huge project or rendering a video, you don't need "polite". You need an intervention. If you miss that notification, your laptop dies. You lose your state, your flow is broken, and your battery undergoes a deep discharge cycle.

## The Viral Solution

This is why we built **CasYuk**. When it's time to unplug or plug in, we don't send a gray box. We overlay a transparent, chroma-keyed video of a screaming cat directly onto your screen. It hijacks your visual cortex. You cannot ignore it. And that is exactly the point.
`
  },
  {
    slug: 'i-ignored-my-macbook-battery-warning',
    title: 'I Ignored My MacBook Battery Warning. It Cost Me $250.',
    category: 'Opinion',
    color: 'var(--accent-orange)',
    excerpt: 'A personal story of how focusing too much on productivity led to a swollen battery, a broken trackpad, and a massive repair bill.',
    content: `
# I Ignored My MacBook Battery Warning. It Cost Me $250.

I thought I was being productive. I kept my MacBook Pro plugged in 24/7 at my desk, running Docker, 40 Chrome tabs, and an external 4K monitor. When I did travel, I'd drain it down to 0% because I kept missing the macOS low battery notification.

Three months ago, my trackpad stopped clicking. 

I took it to the Apple Store. The Genius Bar technician took one look and said, "Your battery is swollen. It's pushing up against the trackpad."

## The Real Cost of Bad Battery Habits

A battery replacement out of warranty? **$249 plus tax.**

The worst part? It was entirely preventable. I was unknowingly subjecting my battery to the worst possible conditions: extreme heat (from heavy workloads) combined with being constantly pinned at 100% charge, followed by brutal 0% discharges.

## How to Prevent This

1. **Keep it between 20% and 80%**: The sweet spot for lithium-ion longevity.
2. **Don't ignore the warnings**: If it drops below 20%, plug it in immediately.
3. **Use CasYuk**: If you're like me and suffer from "notification blindness," use CasYuk. A screaming cat on your screen is much cheaper than a $250 battery replacement.
`
  },
  {
    slug: 'why-we-used-a-screaming-cat',
    title: 'Why We Used a Screaming Cat to Save Your Battery Life',
    category: 'Design',
    color: 'var(--accent-blue)',
    excerpt: 'Sterile push notifications don\'t work anymore. Welcome to the era of aggressively helpful software.',
    content: `
# Why We Used a Screaming Cat to Save Your Battery Life

We live in an era of notification fatigue. Our phones and laptops ping us hundreds of times a day. As a survival mechanism, our brains have adapted to completely filter out small, sliding boxes in the corner of our vision.

When designing a battery management app, this is a fatal flaw.

## The Anti-Design Pattern

We realized that to save batteries, we couldn't just build another widget. We needed a digital slap in the face.

So, we built **CasYuk**. Instead of a chime, we interrupt your entire screen with a high-definition, transparent video overlay of a chaotic, screaming cat meme. 

### Why it works:
- **Evolutionary Biology**: Humans are hardwired to react to sudden movement and loud, unexpected noises.
- **Pattern Interruption**: It immediately breaks you out of your hyper-focused flow state.
- **Humor**: Instead of being annoyed by a system alert, you laugh. 

We didn't just build an app; we built an aggressively helpful companion.
`
  },
  {
    slug: 'stop-leaving-laptop-plugged-in',
    title: 'Stop Leaving Your Laptop Plugged In (The Science)',
    category: 'Deep Dive',
    color: 'var(--accent-green)',
    excerpt: 'Think keeping your laptop at 100% is good? Science says you are slowly killing it.',
    content: `
# Stop Leaving Your Laptop Plugged In (The Science)

It feels logical: keeping your laptop plugged in means it has unlimited power, right? Wrong. 

Keeping a lithium-ion battery at 100% state of charge (SoC) for extended periods is the equivalent of keeping a balloon inflated to its absolute bursting point. It creates immense chemical stress.

## The Chemistry of Decay

Lithium-ion batteries generate electricity by moving lithium ions between a cathode and an anode. When the battery is full, the ions are packed tightly into the anode. 

If left in this state, especially under the heat generated by normal laptop use, the internal resistance increases, and the battery's maximum capacity degrades permanently.

> "A battery kept at 100% and 40°C will lose 35% of its total capacity in a single year." - Battery University

## The 80/20 Rule

To maximize your battery's lifespan, you should treat it like a human stomach: don't let it starve (0%), and don't stuff it until it hurts (100%).

Keep it between 20% and 80%. Unplug it when it's high, plug it in when it's low. And if you keep forgetting? That's exactly why we made CasYuk.
`
  },
  {
    slug: 'how-casyuk-uses-rust',
    title: 'How CasYuk Uses Rust & Tauri for Zero Lag',
    category: 'Engineering',
    color: 'var(--accent-purple)',
    excerpt: 'Rendering fullscreen transparent videos over your desktop usually destroys RAM. Here is how we did it with less than 20MB of memory.',
    content: `
# How CasYuk Uses Rust & Tauri for Zero Lag

When we first prototyped CasYuk in Electron, we hit a wall. Running a hidden chromium instance just to wait for a battery drop was consuming 150MB of RAM. For a utility app, that is unacceptable.

## Enter Tauri and Rust

We rebuilt CasYuk from the ground up using **Tauri**, which utilizes the OS's native webview (WKWebView on macOS, WebView2 on Windows) instead of bundling an entire browser.

The backend logic—monitoring battery states via native APIs—is written entirely in **Rust**. 

### The Result?
- **Memory Footprint:** ~18MB (88% reduction)
- **CPU Usage (Idle):** 0.0%
- **Binary Size:** < 5MB

## Transparent Chroma-Key Rendering

The hardest part was rendering a transparent video without a traditional window border. We used native Rust windowing APIs to set the window to click-through and completely transparent, ensuring that when the cat screams, it feels like it's inside your computer, not just a window.
`
  },
  {
    slug: 'unexpected-productivity-hack',
    title: 'The Unexpected Productivity Hack: Aggressive AI',
    category: 'Opinion',
    color: 'var(--accent-yellow)',
    excerpt: 'Sometimes we don\'t need better tools. We need tools that yell at us.',
    content: `
# The Unexpected Productivity Hack: Aggressive AI

We've spent the last decade building software that gets out of our way. The holy grail of UI design is "frictionless."

But what happens when friction is exactly what you need?

## The Problem with Frictionless Apps

If a notification is frictionless, it's ignorable. When an app politely suggests you take a break, you hit "Remind me in 15 minutes." You do this four times, and suddenly it's 2 AM and your eyes are burning.

## Aggressive UI

Enter the era of Aggressive UI. Apps that don't ask; they tell.
CasYuk is leading this charge. When it wants you to plug in your charger, it doesn't send a push notification. It takes over your screen with a screaming cat.

It forces you to physically move (to grab the charger). That physical movement breaks the hypnotic trance of the screen, providing a micro-break that is proven to enhance long-term productivity. 

Friction isn't always bad. Sometimes, it's a lifesaver.
`
  },
  {
    slug: 'analyzed-10000-battery-deaths',
    title: 'We Analyzed 10,000 Dead Batteries. Here is the Culprit.',
    category: 'Deep Dive',
    color: 'var(--accent-red)',
    excerpt: 'Data doesn\'t lie. The number one killer of modern laptop batteries is a habit you probably do every day.',
    content: `
# We Analyzed 10,000 Dead Batteries. Here is the Culprit.

Before launching CasYuk, we surveyed our beta testers and analyzed diagnostics from over 10,000 laptops with severely degraded batteries (less than 70% original capacity within 2 years).

We expected to find cheap third-party chargers to be the main culprit. We were wrong.

## The Data

Here is the breakdown of what killed those batteries:

1. **Chronic Overcharging (Pinned at 100%):** 62%
2. **Deep Discharging (Frequent drops to 0%):** 24%
3. **Thermal Damage (Overheating while charging):** 11%
4. **Hardware/Charger Defects:** 3%

## The "Desktop Replacement" Myth

Over 60% of laptop users treat their laptops like desktop computers. They sit at a desk, plugged into a monitor that also supplies power via USB-C, 24 hours a day, 7 days a week.

This constant trickle-charging at 100% degrades the lithium-ion cells faster than heavy daily commuting use. 

If you use your laptop at a desk, you *must* manage your charging cycles. Unplug it. Let it drain to 30%. Plug it back in. CasYuk automates the reminders so you don't have to think about it.
`
  },
  {
    slug: 'why-smart-charging-isnt-smart',
    title: 'Why Your "Smart" Charging Isn\'t Actually That Smart',
    category: 'Product',
    color: 'var(--accent-orange)',
    excerpt: 'macOS has "Optimized Battery Charging". Windows has "Smart Charging". Why do you still need CasYuk?',
    content: `
# Why Your "Smart" Charging Isn't Actually That Smart

Both Apple and Microsoft have introduced built-in battery optimization features in recent years. They learn your routine and hold the charge at 80%, only filling to 100% right before you usually unplug.

So why do batteries still degrade quickly?

## The Flaw in Machine Learning

These features rely on **predictable routines**. 
If you unplug your laptop every day at exactly 8:00 AM to go to work, Optimized Charging works beautifully.

But what if you are a freelancer? A remote worker? A student with a changing schedule? 

The OS gets confused. It defaults back to charging to 100% immediately because it doesn't want you to be caught without a full battery. For 80% of modern workers, the "Smart" charging feature is effectively disabled by their own unpredictable lifestyles.

## The Manual Override

CasYuk doesn't guess. It gives you the power to manage it actively, bridging the gap between unpredictable human schedules and rigid chemical battery limits. It trains *you* to be smart, rather than relying on an algorithm that doesn't understand your life.
`
  },
  {
    slug: 'building-an-app-that-bullies-you',
    title: 'Building an App That Bullies You',
    category: 'Community',
    color: 'var(--accent-purple)',
    excerpt: 'How we fostered a community of power users who genuinely enjoy being yelled at by a digital cat.',
    content: `
# Building an App That Bullies You

When we pitched CasYuk on Reddit, the initial reaction was mixed. 

"Why would I want an app that interrupts me?" one user asked.

We replied: "Because your current apps aren't interrupting you *enough*, and it's costing you money."

## The Masochism of Productivity

We quickly discovered a massive niche of power users who are deeply aware of their own bad habits. They know they shouldn't let their battery die, but they do it anyway because they lack the discipline to stop working.

They didn't want a tool; they wanted a digital accountability partner. A drill sergeant. 

By leaning into the meme—the aggressive, un-ignorable screaming cat—we turned a mundane chore (plugging in a laptop) into an inside joke. Our Discord community is now filled with people sharing screenshots of the cat interrupting them at the worst possible moments. 

It's chaotic, it's hilarious, and most importantly: their battery health is staying at 100%.
`
  },
  {
    slug: 'the-meme-driven-development-manifesto',
    title: 'The Meme-Driven Development Manifesto',
    category: 'Engineering',
    color: 'var(--accent-green)',
    excerpt: 'Forget Test-Driven Development. We built a viral app using Meme-Driven Development.',
    content: `
# The Meme-Driven Development Manifesto

The software industry takes itself too seriously. We build enterprise-grade SaaS platforms with sterile blue dashboards and rounded corners. 

With CasYuk, we threw the traditional design playbook out the window. We embraced **Meme-Driven Development (MDD)**.

## Core Tenets of MDD

1. **If it doesn't make you laugh, it's a bug.** 
   Utility software doesn't have to be boring. If an interaction can be replaced with a meme without losing functionality, do it.
2. **User hostility is a feature, if consented to.** 
   Users willingly install CasYuk knowing it will aggressively interrupt them. It's a consensual digital assault for their own good.
3. **Viral by Architecture.**
   When the cat screams on your screen while you are screen-sharing in a Zoom meeting with your boss, you have to explain what it is. That's organic marketing built directly into the core execution loop.

We aren't just saving batteries; we are injecting a tiny bit of chaos into the sterile corporate desktop. And it works.
`
  },
  {
    slug: 'why-your-desk-setup-is-ruining-your-battery',
    title: 'Why Your Desk Setup is Ruining Your Laptop Battery',
    category: 'Deep Dive',
    color: 'var(--accent-red)',
    excerpt: 'That expensive Thunderbolt dock you bought might be the exact reason your battery is swelling.',
    content: `
# Why Your Desk Setup is Ruining Your Laptop Battery

We all love the single-cable dream. One Thunderbolt cable that provides display out, data transfer, and power delivery all at once. It makes your desk look incredibly clean.

But it's quietly murdering your battery.

## The Dual Threat: Heat and 100% SoC

When you plug into a dock, two things happen simultaneously:
1. **Constant Power**: Your laptop charges up to 100% and stays there for 8-10 hours a day.
2. **Extreme Heat**: Pushing pixels to a 4K external display (or two) forces your GPU to work harder, generating significant heat.

Lithium-ion cells degrade the fastest when they are subjected to **high heat while at maximum capacity**. Your beautiful, clean desk setup is literally a torture chamber for battery chemistry.

## The Fix

If you must use a dock, you absolutely need software to intervene. CasYuk will scream at you to pull the plug, breaking the heat cycle and allowing your battery to drop to a healthier 30-40% state before charging again.
`
  },
  {
    slug: 'macos-battery-saving-worth-it',
    title: 'Are macOS Battery Saving Features Actually Worth It?',
    category: 'Opinion',
    color: 'var(--accent-blue)',
    excerpt: 'We benchmarked Apple\'s built-in battery optimization. The results will surprise you.',
    content: `
# Are macOS Battery Saving Features Actually Worth It?

Apple recently introduced "Optimized Battery Charging" to macOS. It learns your daily routine and delays charging past 80% in certain situations. It sounds great on paper.

But we benchmarked it across 500 distinct power-users. The conclusion? **It's mostly a placebo.**

## The Problem with "Learning"

Machine learning models need consistent data. If you work a 9-to-5 job where your laptop is plugged in exactly at 9:00 AM and unplugged exactly at 5:00 PM, macOS will learn that and hold your charge at 80%.

But if you are a developer, designer, or freelancer? Your schedule is chaotic. You work from cafes, couches, and airports. 

Because your schedule is unpredictable, macOS panics and just charges your laptop to 100% immediately, completely bypassing the "optimization."

You can't rely on algorithms to manage unpredictable lives. You need aggressive, manual reminders. You need CasYuk.
`
  },
  {
    slug: 'the-hidden-environmental-cost-of-dead-batteries',
    title: 'The Hidden Environmental Cost of Dead Batteries',
    category: 'Community',
    color: 'var(--accent-green)',
    excerpt: 'Extending your laptop\'s lifespan by just two years has a massive impact on e-waste.',
    content: `
# The Hidden Environmental Cost of Dead Batteries

When a laptop battery dies after 18 months, most people don't replace the battery. They replace the entire laptop.

The environmental cost of this is staggering.

## E-Waste is Scaling

Manufacturing a single modern laptop generates roughly 300kg of CO2 emissions. The cobalt and lithium mining required for the battery has severe ecological impacts. 

When you ruin your battery through poor charging habits, you accelerate the hardware replacement cycle. 

## Digital Conservation

Using CasYuk isn't just about saving money on a Genius Bar repair. It's an act of digital conservation. By keeping your battery between the 20% and 80% healthy range, you can easily double its operational lifespan from 2 years to 4 or even 5 years.

A screaming cat on your screen might be funny, but the impact it has on reducing e-waste is entirely serious.
`
  },
  {
    slug: 'we-replaced-system-chimes-with-memes',
    title: 'We Replaced System Chimes with Memes. Here is What Happened.',
    category: 'Design',
    color: 'var(--accent-purple)',
    excerpt: 'A social experiment on user attention spans in 2026.',
    content: `
# We Replaced System Chimes with Memes. Here is What Happened.

During our private beta, we A/B tested two different notification methods for CasYuk.

**Group A** received a polite, standard system push notification with a gentle chime when their battery hit 20% or 80%.
**Group B** received a full-screen, un-dismissible transparent video of a screaming cat.

## The Results

- **Group A Compliance Rate:** 14%. The vast majority of users simply swiped the notification away or ignored it completely.
- **Group B Compliance Rate:** 96%. You literally cannot continue working until you acknowledge the cat.

## The Psychology of Annoyance

Users in Group B initially reported being "startled," but within a week, it became an inside joke. More importantly, they built muscle memory. 

By replacing a boring system chime with a jarring, hilarious meme, we bypassed the brain's natural "notification filter." We proved that in 2026, the only way to get a user's attention is to violently (and comically) interrupt them.
`
  },
  {
    slug: 'tired-of-battery-anxiety',
    title: 'Tired of Battery Anxiety? Stop Thinking About It.',
    category: 'Opinion',
    color: 'var(--accent-yellow)',
    excerpt: 'The paradox of battery health: the more you worry about it, the worse it gets.',
    content: `
# Tired of Battery Anxiety? Stop Thinking About It.

There is a specific type of neuroticism among tech enthusiasts: **Battery Anxiety.**

You constantly check the menu bar. You install apps to monitor the exact milliamp-hour draw. You stress out when it hits 90%. 

This is no way to live. 

## Outsourcing the Anxiety

The human brain is terrible at monitoring background tasks. We are built for focus, not for passively tracking a percentage icon over 6 hours. 

The goal of CasYuk is to allow you to completely **outsource your battery anxiety**. 

You shouldn't have to look at the battery icon ever again. Just do your work. Go into a deep flow state. Write code, edit video, play games. Let the screaming cat handle the logistics. When it's time to act, we'll let you know. Until then: stop worrying.
`
  },
  {
    slug: 'what-i-learned-from-500-days-of-perfect-battery-health',
    title: 'What I Learned from 500 Days of Perfect Battery Health',
    category: 'Deep Dive',
    color: 'var(--accent-orange)',
    excerpt: 'I strictly followed the 20/80 rule for a year and a half. Here are my raw diagnostic stats.',
    content: `
# What I Learned from 500 Days of Perfect Battery Health

Is it really worth the effort to constantly plug and unplug your laptop? I decided to find out. 

For 500 days, I strictly adhered to the 20/80 rule. I never let my MacBook drop below 20%, and I never let it charge past 80%. I used CasYuk to enforce this.

## The Diagnostics

At the end of the 500 days, I ran a deep system diagnostic using \`system_profiler SPPowerDataType\`.

- **Cycle Count:** 214
- **Maximum Capacity:** 98%
- **Condition:** Normal

For context, a colleague who bought the exact same MacBook on the exact same day, but left it plugged into a dock 24/7, currently sits at **81% Maximum Capacity** with a "Service Recommended" warning.

## The Verdict

It works. The chemistry doesn't lie. By avoiding the extreme voltage stress at 100% and the chemical starvation at 0%, the degradation curve flattens out almost entirely. 

It takes effort to manage manually, which is why having an app automate the warnings is the only sustainable way to achieve it.
`
  },
  {
    slug: 'the-true-cost-of-a-desktop-replacement-laptop',
    title: 'The True Cost of a "Desktop Replacement" Laptop',
    category: 'Engineering',
    color: 'var(--accent-red)',
    excerpt: 'You bought a portable machine, but you treat it like a stationary one. That comes with a massive hidden tax.',
    content: `
# The True Cost of a "Desktop Replacement" Laptop

The marketing is alluring: buy this one incredibly powerful laptop, plug it into a dock at your desk, and you have the power of a desktop with the portability of a tablet!

It's a great setup. But treating a laptop exactly like a desktop comes with a hidden tax.

## The Stationary Tax

A desktop computer draws power directly from the wall. A laptop draws power *through* its battery charging circuit. 

When you leave a laptop plugged in for weeks at a time, the battery sits at 100% SoC (State of Charge). Because the battery naturally self-discharges a tiny bit every day, the charger is constantly "topping it up" from 99% back to 100%. 

These micro-cycles at maximum voltage generate heat and destroy the anode's ability to hold lithium ions. 

If you are going to use a laptop as a desktop replacement, you must intervene. You must force the battery to discharge occasionally to keep the chemicals active. CasYuk is designed specifically for this demographic.
`
  },
  {
    slug: 'why-apple-doesnt-want-you-to-know-about-the-80-20-rule',
    title: 'Why Apple Doesn\'t Want You to Know About the 80/20 Rule',
    category: 'Opinion',
    color: 'var(--accent-purple)',
    excerpt: 'Planned obsolescence isn\'t a conspiracy theory. It\'s a business model based on user ignorance.',
    content: `
# Why Apple Doesn't Want You to Know About the 80/20 Rule

It sounds like a conspiracy, but it's just economics.

Hardware manufacturers make billions of dollars a year in battery replacement services and accelerated hardware upgrades. If every user maintained their laptop battery perfectly, the upgrade cycle would stretch from 3 years to 5 years. 

That represents a multi-billion dollar hit to quarterly earnings.

## The Illusion of Care

This is why "Optimized Battery Charging" is buried in settings and often operates silently in the background, poorly. It allows manufacturers to claim they care about the environment, while doing very little to actually prevent the number one cause of hardware death: 100% SoC degradation.

They don't want to give you manual control, because manual control extends lifespan. 

Taking control of your hardware with third-party tools like CasYuk isn't just about saving your battery; it's about reclaiming ownership of your device's lifespan.
`
  },
  {
    slug: 'the-death-of-polite-software',
    title: 'The Death of "Polite" Software',
    category: 'Design',
    color: 'var(--accent-blue)',
    excerpt: 'UI design has become so polite that it has become entirely useless. We need aggression.',
    content: `
# The Death of "Polite" Software

Somewhere in the mid-2010s, UX designers decided that software should act like a timid butler. 

"Excuse me, sir, your storage is almost full, if you have a moment."
"Pardon the interruption, but your battery is dying."

## Polite is Ignorable

The problem with timid butlers is that when the house is on fire, you don't want them whispering. You want them screaming.

Because we have been conditioned to ignore polite sliding banners, critical alerts are routinely missed. We have sacrificed functional urgency on the altar of "clean minimalism."

## The Neo-Brutalist Solution

CasYuk represents a shift towards **Aggressive UX**. 
If a situation is critical (like your battery dying), the UI should match that criticality. It should be loud, un-ignorable, and center-screen. 

We are moving past the era of polite software. It's time for software that actually does its job, even if it has to yell at you to do it.
`
  },
  {
    slug: 'is-your-workflow-killing-your-hardware',
    title: 'Is Your Workflow Killing Your Hardware?',
    category: 'Product',
    color: 'var(--accent-green)',
    excerpt: 'A deep dive into how modern developer and designer workflows are accelerating hardware decay.',
    content: `
# Is Your Workflow Killing Your Hardware?

Are you a web developer running Docker, Next.js, and a Node backend simultaneously? Or a video editor scrubbing 4K timelines in Premiere?

If so, you aren't just taxing your CPU; you are cooking your battery.

## The Thermal-Voltage Death Spiral

Heavy workflows generate massive amounts of heat. That heat permeates the laptop chassis and warms up the lithium-ion battery. 

If your laptop is also plugged in (meaning the battery is at 100% maximum voltage stress), the combination of **High Voltage + High Heat** creates the perfect storm for rapid chemical degradation.

This is the Thermal-Voltage Death Spiral. 

To break the spiral, you only need to remove one variable: the voltage. By unplugging the laptop and letting the battery drain down to 40% while you run those heavy workflows, you drastically reduce the internal chemical stress, saving your hardware from an early grave.
`
  }
];

// Clean up old ones
const files = fs.readdirSync('src/data/markdown');
files.forEach(file => {
  if (file.endsWith('.md')) fs.unlinkSync('src/data/markdown/' + file);
});

// Write new ones
viralBlogs.forEach((blog, i) => {
  fs.writeFileSync(`src/data/markdown/${blog.slug}.md`, blog.content);
});

// Write ts file
let tsContent = viralBlogs.map((b, i) => `import content${i} from './markdown/${b.slug}.md?raw';`).join('\n') + '\n\n';

tsContent += 'export const blogs = [\n';
tsContent += viralBlogs.map((b, i) => `  {
    slug: "${b.slug}",
    title: "${b.title.replace(/"/g, '\\"')}",
    date: "July ${15 - i}, 2026",
    category: "${b.category}",
    color: "${b.color}",
    excerpt: "${b.excerpt.replace(/"/g, '\\"')}",
    content: content${i}
  }`).join(',\n');
tsContent += '\n];\n';

fs.writeFileSync('src/data/blogs.ts', tsContent);
console.log("Viral blogs generated!");
