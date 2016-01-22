# meshblu-drink-bot

### Edison meshblu

edison.local:3040

### Drive code creds

```
{
  "uuid": "69e93636-9bcd-43a1-a919-2fc41ecdc5a4",
  "token": "de916f5f67c641fff155845a641a08d09177f2aa",
  "server": "edison.local",
  "port": "3040"
}


```

### Face credentials
```
{
  "uuid": "5285ddf7-5250-4f92-ae0a-b783e4fda87b",
  "token": "1e7387b9bcb14b9606d4fe6e077d7f886323b9c6",
  "server": "edison.local",
  "port": "3040"
}
```

### Order credentials
```
{
  "uuid": "cb75551b-aa8b-45f5-839d-e7b1dd7fb422",
  "token": "30412d776fc229cf01e8827d13328cf0c3fdc8a0",
  "server": "edison.local",
  "port": "3040"
}
```

## dispensing

Send payload: "dispense" to UUID = "69e93636-9bcd-43a1-a919-2fc41ecdc5a4"

## To DO


- WELD!

### Aesthetic

- tablet mounts
- get industrial velcro for side panels
- table top laser cut

### Turret

- Sensors? (hall effect)


### Software

### Tablet 1 : Face

- Animated face (max headroom style?)
- Says in synthesized voice "Hey we're dispensing ec cetera"
- Sends base64 images to

```
var uuid = "5174db30-7ce5-4d28-86bb-e7413f156730";
var token = "899c117e8fe27be5f85837f192505ad7e815135a";
```

### Tablet 2 : Drive Interface

credentials:
```
{
  "uuid": "2163503e-91ac-48bc-b57f-0b2e8be6b7ce",
  "token": "85e2b4f4a37aa1b6f5f6af01c1d804c2ea4a41e7",
  "server": "edison.local",
  "port": "3040"
}

```

- Located in intel-robot-interface/control.html
- It has a touch joystick that talks to the robot
- It displays base64 images in the center
- Has buttons for manually running dispense/reload

### Tablet 3 : Chest Marquee

- Goes on the Chest
- Just marquees some text

### Tablet 4: Order

- A page with some options, there is only one real option available though
- Select the option -> Confirm -> send payload: "dispense" to "uuid": "86d518e3-15cd-4eef-9cd0-2f4072bf08d7"
- Send some command to the face tablet to do its thing. "Now dispensing" maybe a random joke too?
