
# What I Learned from 500 Days of Perfect Battery Health

Is it really worth the effort to constantly plug and unplug your laptop? I decided to find out. 

For 500 days, I strictly adhered to the 20/80 rule. I never let my MacBook drop below 20%, and I never let it charge past 80%. I used CasYuk to enforce this.

## The Diagnostics

At the end of the 500 days, I ran a deep system diagnostic using `system_profiler SPPowerDataType`.

- **Cycle Count:** 214
- **Maximum Capacity:** 98%
- **Condition:** Normal

For context, a colleague who bought the exact same MacBook on the exact same day, but left it plugged into a dock 24/7, currently sits at **81% Maximum Capacity** with a "Service Recommended" warning.

## The Verdict

It works. The chemistry doesn't lie. By avoiding the extreme voltage stress at 100% and the chemical starvation at 0%, the degradation curve flattens out almost entirely. 

It takes effort to manage manually, which is why having an app automate the warnings is the only sustainable way to achieve it.
