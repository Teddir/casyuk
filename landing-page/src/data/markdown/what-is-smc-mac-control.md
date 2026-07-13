# What is the SMC and How to Control It on a Mac

The **SMC (System Management Controller)** is a custom chip (or a subsystem in Apple Silicon) that manages low-level hardware functions on your Mac. It controls the fans, the keyboard backlight, power management, and most importantly, battery charging.

## How Battery Limiters Work

When you plug in a MacBook, the SMC negotiates power with the charger. By default, it allows charge until the battery reads 100%.

Apps like CasYuk send custom IOKit commands directly to the SMC. We tell the SMC: "Hey, pretend the battery is full when it hits 80%." The SMC then physically cuts off power to the battery cells, routing the wall power directly to the CPU and logic board.

This is why CasYuk is so effective—it's not a software trick; it's a hardware override.