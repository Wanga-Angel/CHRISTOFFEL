# CHRISTOFFEL

Who will use the application?-	The primary user is the restaurant's chef, who handles daily menu adjustments. The owner, Christoffel, might also log in to view or audit the overall dish line-up.
What is the purpose of the application?	-To digitize and streamline menu management. It replaces the messy, slow paper system so the chef can instantly add, view, update, and sort dishes right from a smartphone.
What information must the application store?-	It needs to securely hold all key details for each dish, which includes the name of the meal, a short description, what course it belongs to (like starters or mains), and the price.
List four functions the application should perform.-	1. Add a brand-new dish to the system.
2. Display a neat, scrollable list of everything currently on the menu.
3. Edit existing dish details, descriptions, or prices when things change.
4. Filter the menu view by course categories to keep things organized.
List two usability requirements the application should have.-	1. High contrast and big text: Kitchens get chaotic and hot, so the text needs to be easy to read at a quick glance while cooking.
2. Fast, simple navigation: The chef shouldn't have to fight with the app; saving or finding a dish needs to take just a few quick taps.

Design Reflection 
This mobile application layout focuses entirely on solving the real-world headaches of running a busy kitchen. Swapping out a stained, easily lost paper menu for a clean digital app saves valuable time when the dinner rush hits. Because kitchens are loud, high-pressure environments, the app avoids tiny buttons. Instead, it relies on large input fields, obvious labels, and custom number-only pads for pricing. These small, thoughtful choices go a long way in preventing annoying typos when the chef is trying to type with messy hands or while multi-tasking.
The specific React Native components were chosen to make the app feel second nature to use. By utilizing a native <Picker> dropdown for course selection, the chef can categorize a meal with one tap rather than wasting time typing "Starter" or "Main Course" repeatedly. This keeps the restaurant's menu data perfectly uniform. 
While the <Flat List> component does the heavy lifting on the homepage, rendering a clean list that stays incredibly smooth and responsive, even as Christoffel expands the menu with dozens of new recipes over time. 
Finally, using <Touchable Opacity> for the buttons gives the user satisfying visual feedback. Seeing the button react instantly lets a busy chef confidently lock their phone and get straight back to the stove, turning what used to be a frustrating administrative chore into a quick, five-second routine.

youtube: https://youtu.be/W42t8NY6H_U?si=w7vAyHqf6uyE2cje
