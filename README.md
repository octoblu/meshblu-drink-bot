# meshblu-drink-bot

### Edison meshblu

edison.local:3040

### Drive code creds

```
{
  "uuid": "86d518e3-15cd-4eef-9cd0-2f4072bf08d7",
  "token": "294482576df024d55156c796c18a81ab1d010810",
  "server": "edison.local",
  "port": "3040"
}

```

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
var uuid = "5174db30-7ce5-4d28-86bb-e7413f156730";
var token = "899c117e8fe27be5f85837f192505ad7e815135a";
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
