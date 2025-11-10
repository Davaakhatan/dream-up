# Demo Video Scenarios

## Scenario 1: Testing a Simple Game (Recommended for Demo)

**Game:** https://play2048.co/

**Why:** 
- Fast loading
- Clear gameplay
- Easy to understand results
- Reliable (always works)

**Steps:**
1. Open dashboard
2. Enter URL: `https://play2048.co/`
3. Click "Run Test"
4. Wait ~30 seconds
5. Show results

**Expected Results:**
- Playability score: 80-90
- Screenshots showing game tiles
- No critical issues
- Fast execution time

---

## Scenario 2: Testing a Complex Game

**Game:** https://funhtml5games.com/pacman/index.html

**Why:**
- Shows cookie consent handling
- Shows menu navigation
- More complex interactions
- Real-world scenario

**Steps:**
1. Open dashboard
2. Enter URL: `https://funhtml5games.com/pacman/index.html`
3. Click "Run Test"
4. Wait ~60 seconds
5. Show how it handled cookies/menus
6. Show results

**Expected Results:**
- Playability score: 70-85
- Screenshots showing game in action
- May show some warnings (ads, etc.)
- Demonstrates smart navigation

---

## Scenario 3: Testing Multiple Games (Comparison)

**Games:**
1. https://play2048.co/
2. https://www.crazygames.com/game/2048
3. https://www.addictinggames.com/puzzle/2048

**Why:**
- Shows batch testing capability
- Compares different implementations
- Shows statistics updating
- Demonstrates scalability

**Steps:**
1. Run first test
2. While it runs, start second test
3. Show multiple tests in progress
4. Compare results side-by-side
5. Show statistics dashboard

---

## Scenario 4: Error Handling

**Game:** Invalid URL or broken game

**Why:**
- Shows error handling
- Demonstrates graceful degradation
- Shows helpful error messages

**Steps:**
1. Enter invalid URL
2. Show validation error
3. Enter URL of broken game
4. Show error report with details
5. Show how it still captures evidence

---

## Scenario 5: Feature Showcase

**Focus:** Showcase specific features

**Steps:**
1. **Input Schema:** Show how to configure custom controls
2. **Screenshot Gallery:** Browse through captured screenshots
3. **Issue Details:** Expand and explain issue categories
4. **Test History:** Show past test reports
5. **Export:** Show JSON report download

---

## Recommended Demo Flow:

### For First-Time Viewers:
1. Start with Scenario 1 (Simple game) - builds confidence
2. Show Scenario 2 (Complex game) - demonstrates capabilities
3. Quick Scenario 4 (Error handling) - shows robustness
4. End with Scenario 5 (Features) - highlights value

### For Technical Audience:
1. Start with Scenario 3 (Multiple games) - shows scale
2. Deep dive Scenario 5 (Features) - technical details
3. Show Scenario 2 (Complex game) - real-world use

### For Quick Demo (30-60 seconds):
1. Scenario 1 only - simple and fast

---

## Games to Test (Pre-validated):

### Simple & Fast:
- ✅ https://play2048.co/ (Best for demo)
- ✅ https://www.nytimes.com/games/wordle (if accessible)
- ✅ https://skribbl.io/ (may need to handle lobby)

### Medium Complexity:
- ✅ https://funhtml5games.com/pacman/index.html
- ✅ https://www.crazygames.com/game/2048
- ⚠️ https://www.addictinggames.com/ (may have ads)

### Complex (Showcase):
- ⚠️ https://www.coolmathgames.com/ (many redirects)
- ⚠️ https://www.kongregate.com/ (complex navigation)

---

## Tips:

1. **Test games beforehand** - make sure they work
2. **Have backup games** ready in case one fails
3. **Use games you know work well** - reliability is key
4. **Show variety** - different game types demonstrate versatility
5. **Keep it simple** - don't overcomplicate the demo

