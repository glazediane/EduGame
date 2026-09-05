// src/data/questions/grade4/math.jsx

export const grade4Math = {
  // ==================== EASY LEVELS (1 - 5) ====================
  1: [ // Easy: Angles, Triangles, and Quadrilaterals
    { q: "What type of angle measures exactly 90 degrees?", options: ["Acute", "Right", "Obtuse"], a: "Right", hint: "It forms a perfect square corner." },
    { q: "An angle that measures 45 degrees is classified as what type of angle?", options: ["Acute", "Right", "Obtuse"], a: "Acute", hint: "It is smaller than 90 degrees." },
    { q: "An angle measuring 120 degrees is called an ___ angle.", options: ["Acute", "Right", "Obtuse"], a: "Obtuse", hint: "It is greater than 90 degrees but less than 180 degrees." },
    { q: "What tool is used to measure and draw angles accurately?", options: ["Ruler", "Protractor", "Compass"], a: "Protractor", hint: "A semi-circular tool marked with degrees." },
    { q: "How many sides does a triangle have?", options: ["3", "4", "5"], a: "3", hint: "Tri- means three." },
    { q: "How many sides does a quadrilateral have?", options: ["3", "4", "5"], a: "4", hint: "Quad- means four." },
    { q: "A triangle with all 3 sides equal in length is called:", options: ["Equilateral", "Isosceles", "Scalene"], a: "Equilateral", hint: "All sides are equal." },
    { q: "A triangle with 2 equal sides is called an ___ triangle.", options: ["Equilateral", "Isosceles", "Scalene"], a: "Isosceles", hint: "It has two matching side lengths." },
    { q: "A triangle with no equal sides is called:", options: ["Equilateral", "Isosceles", "Scalene"], a: "Scalene", hint: "All three sides have different lengths." },
    { q: "Which quadrilateral has 4 equal sides and 4 right angles?", options: ["Rectangle", "Square", "Rhombus"], a: "Square", hint: "It is both equal-sided and right-angled." }
  ],
  2: [ // Easy: Perimeter of Quadrilaterals and Composite Figures
    { q: "What is the perimeter of a quadrilateral with side lengths 5 cm, 7 cm, 6 cm, and 8 cm?", options: ["26 cm", "24 cm", "28 cm"], a: "26 cm", hint: "Add all four sides: 5 + 7 + 6 + 8." },
    { q: "Find the perimeter of a trapezoid with sides measuring 4 cm, 5 cm, 6 cm, and 7 cm.", options: ["22 cm", "20 cm", "24 cm"], a: "22 cm", hint: "Add all sides together." },
    { q: "What is perimeter?", options: ["The area inside a shape", "The total distance around a shape", "The height of a shape"], a: "The total distance around a shape", hint: "Add up all outer boundaries." },
    { q: "A rhombus has sides of length 9 cm each. What is its perimeter?", options: ["36 cm", "27 cm", "18 cm"], a: "36 cm", hint: "Multiply 9 by 4 sides." },
    { q: "Calculate the perimeter of a quadrilateral with sides 10 m, 12 m, 15 m, and 8 m.", options: ["45 m", "40 m", "50 m"], a: "45 m", hint: "10 + 12 + 15 + 8 = 45." },
    { q: "A composite figure is made of a triangle (sides 3 cm, 4 cm, 5 cm) joined along one side to a square (side 4 cm). What is the outer perimeter?", options: ["16 cm", "18 cm", "20 cm"], a: "16 cm", hint: "Sum only the exterior boundary lines." },
    { q: "What is the perimeter of a parallelogram with side lengths 6 cm and 10 cm?", options: ["32 cm", "16 cm", "20 cm"], a: "32 cm", hint: "Opposite sides are equal: 6 + 10 + 6 + 10." },
    { q: "Find the perimeter of a triangle with sides measuring 8 cm, 9 cm, and 10 cm.", options: ["27 cm", "25 cm", "30 cm"], a: "27 cm", hint: "Sum of 8 + 9 + 10." },
    { q: "If a non-square quadrilateral has side lengths 3 cm, 4 cm, 5 cm, and 6 cm, what is its perimeter?", options: ["18 cm", "20 cm", "15 cm"], a: "18 cm", hint: "Add 3 + 4 + 5 + 6." },
    { q: "To find the perimeter of any polygon, you must ___ the lengths of all its outer sides.", options: ["Multiply", "Add", "Divide"], a: "Add", hint: "Perimeter is the sum of side lengths." }
  ],
  3: [ // Easy: Place Value and Value of Whole Numbers (up to 1,000,000)
    { q: "In the number 458,219, what is the place value of the digit 5?", options: ["Ten thousands", "Thousands", "Hundred thousands"], a: "Ten thousands", hint: "Count from right: ones, tens, hundreds, thousands, ten thousands." },
    { q: "What is the value of the digit 7 in 723,405?", options: ["700,000", "70,000", "7,000"], a: "700,000", hint: "7 is in the hundred thousands place." },
    { q: "Write 'six hundred four thousand, twelve' in digits:", options: ["604,012", "640,012", "604,120"], a: "604,012", hint: "604 in thousands period, 012 in ones period." },
    { q: "Which digit is in the hundred thousands place in 891,234?", options: ["8", "9", "1"], a: "8", hint: "First digit from the left in a 6-digit number." },
    { q: "What is the place value of 0 in 502,381?", options: ["Ten thousands", "Thousands", "Hundreds"], a: "Ten thousands", hint: "It holds the ten thousands position." },
    { q: "What is 300,000 + 40,000 + 5,000 + 600 + 20 + 8 in standard form?", options: ["345,628", "354,628", "345,268"], a: "345,628", hint: "Combine all expanded values." },
    { q: "In 912,456, what is the value of the digit 2?", options: ["2,000", "20,000", "200"], a: "2,000", hint: "2 is in the thousands place." },
    { q: "Which number has a 9 in the thousands place?", options: ["429,100", "492,100", "942,100"], a: "429,100", hint: "Check the 4th digit from the right." },
    { q: "How do you write 1,000,000 in words?", options: ["One million", "One hundred thousand", "Ten million"], a: "One million", hint: "1 followed by 6 zeros." },
    { q: "What is the value of 0 in any number place value?", options: ["0", "10", "100"], a: "0", hint: "Zero always represents a value of 0." }
  ],
  4: [ // Easy: Comparing and Rounding Whole Numbers
    { q: "Compare: 456,789 ___ 456,879", options: ["<", ">", "="], a: "<", hint: "789 is smaller than 879." },
    { q: "Compare: 800,000 ___ 799,999", options: [">", "<", "="], a: ">", hint: "800,000 is larger." },
    { q: "Round 482,105 to the nearest hundred thousand.", options: ["500,000", "400,000", "480,000"], a: "500,000", hint: "Look at digit 8 in ten thousands place (5 or higher rounds up)." },
    { q: "Round 239,800 to the nearest hundred thousand.", options: ["200,000", "300,000", "240,000"], a: "200,000", hint: "Digit 3 in ten thousands place is less than 5." },
    { q: "Which comparison statement is correct?", options: ["123,456 > 123,654", "543,210 > 542,310", "99,999 = 100,000"], a: "543,210 > 542,310", hint: "543 thousand is greater than 542 thousand." },
    { q: "Estimate the sum of 410,000 and 280,000 by rounding to the nearest hundred thousand.", options: ["700,000", "600,000", "800,000"], a: "700,000", hint: "400,000 + 300,000 = 700,000." },
    { q: "What symbol makes this true: 654,321 ___ 654,321?", options: ["=", ">", "<"], a: "=", hint: "Both numbers are identical." },
    { q: "Round 750,000 to the nearest hundred thousand.", options: ["800,000", "700,000", "750,000"], a: "800,000", hint: "5 in ten thousands rounds up." },
    { q: "Which number is the largest?", options: ["909,909", "990,009", "909,990"], a: "990,009", hint: "Compare digit by digit from left to right." },
    { q: "Estimate the difference of 890,000 - 310,000 (round to nearest hundred thousand).", options: ["600,000", "500,000", "700,000"], a: "600,000", hint: "900,000 - 300,000 = 600,000." }
  ],
  5: [ // Easy: Basic Operations (Addition, Subtraction, Simple Multiplication)
    { q: "Find the sum: 250,000 + 150,000.", options: ["400,000", "350,000", "450,000"], a: "400,000", hint: "250 + 150 = 400 thousands." },
    { q: "Find the difference: 500,000 - 200,000.", options: ["300,000", "200,000", "400,000"], a: "300,000", hint: "500 - 200 = 300 thousands." },
    { q: "Multiply: 1,200 x 4.", options: ["4,800", "4,200", "4,600"], a: "4,800", hint: "12 x 4 = 48, then add two zeros." },
    { q: "Multiply: 300 x 20.", options: ["6,000", "600", "60,000"], a: "6,000", hint: "3 x 2 = 6, append three zeros." },
    { q: "What is 450,000 + 320,000?", options: ["770,000", "750,000", "780,000"], a: "770,000", hint: "450 + 320 = 770." },
    { q: "What is 850,000 - 430,000?", options: ["420,000", "410,000", "430,000"], a: "420,000", hint: "850 - 430 = 420." },
    { q: "What is 2,000 x 3?", options: ["6,000", "5,000", "600"], a: "6,000", hint: "2 x 3 = 6." },
    { q: "If you add 0 to any number, the answer is:", options: ["The same number", "Zero", "One"], a: "The same number", hint: "Identity property of addition." },
    { q: "If you multiply any number by 0, the answer is:", options: ["0", "1", "The same number"], a: "0", hint: "Zero property of multiplication." },
    { q: "Calculate: 150,000 + 250,000 + 100,000.", options: ["500,000", "400,000", "600,000"], a: "500,000", hint: "150 + 250 + 100 = 500 thousands." }
  ],

  // ==================== MEDIUM LEVELS (6 - 10) ====================
  6: [ // Medium: Multiplication and Division of Whole Numbers
    { q: "Multiply: 423 x 12.", options: ["5,076", "5,066", "4,076"], a: "5,076", hint: "423 x 10 = 4230; 423 x 2 = 846; 4230 + 846 = 5076." },
    { q: "Divide: 1,440 ÷ 12.", options: ["120", "110", "130"], a: "120", hint: "144 ÷ 12 = 12." },
    { q: "What is the quotient of 2,500 ÷ 5?", options: ["500", "50", "5,000"], a: "500", hint: "25 ÷ 5 = 5." },
    { q: "Multiply: 1,250 x 8.", options: ["10,000", "9,000", "10,500"], a: "10,000", hint: "125 x 8 = 1000." },
    { q: "Estimate the product of 48 x 21 by rounding to nearest tens.", options: ["1,000", "800", "1,200"], a: "1,000", hint: "50 x 20 = 1,000." },
    { q: "Estimate the quotient of 812 ÷ 9 by using compatible numbers.", options: ["90", "80", "100"], a: "90", hint: "810 ÷ 9 = 90." },
    { q: "Divide: 3,600 ÷ 60.", options: ["60", "600", "6"], a: "60", hint: "360 ÷ 6 = 60." },
    { q: "Multiply: 312 x 3.", options: ["936", "926", "946"], a: "936", hint: "300x3 + 10x3 + 2x3." },
    { q: "Divide: 848 ÷ 4.", options: ["212", "202", "222"], a: "212", hint: "800÷4 + 40÷4 + 8÷4." },
    { q: "What is the remainder when 25 is divided by 4?", options: ["1", "2", "3"], a: "1", hint: "24 is divisible by 4 (4 x 6 = 24)." }
  ],
  7: [ // Medium: Order of Operations (MDAS Rules)
    { q: "Solve using MDAS rules: 10 + 5 x 2", options: ["20", "30", "25"], a: "20", hint: "Multiply first: 5 x 2 = 10, then 10 + 10 = 20." },
    { q: "Solve: 20 - 12 ÷ 3", options: ["16", "2", "12"], a: "16", hint: "Divide first: 12 ÷ 3 = 4, then 20 - 4 = 16." },
    { q: "Evaluate: 8 x 4 ÷ 2", options: ["16", "1", "32"], a: "16", hint: "Work left to right for multiplication and division." },
    { q: "Solve: 15 + 6 - 4 x 2", options: ["13", "34", "26"], a: "13", hint: "Multiply first: 4 x 2 = 8; then 15 + 6 - 8 = 13." },
    { q: "What operation do you perform FIRST in: 12 - 3 x 2 + 8?", options: ["Multiplication", "Subtraction", "Addition"], a: "Multiplication", hint: "MDAS rule: Multiplication before Addition/Subtraction." },
    { q: "Evaluate: 50 - 10 x 4 + 5", options: ["15", "165", "160"], a: "15", hint: "10 x 4 = 40; 50 - 40 = 10; 10 + 5 = 15." },
    { q: "Solve: 18 ÷ 3 x 2", options: ["12", "3", "27"], a: "12", hint: "Perform left to right: 18 ÷ 3 = 6, then 6 x 2 = 12." },
    { q: "Solve: 24 ÷ 6 + 2 x 5", options: ["14", "30", "20"], a: "14", hint: "24 ÷ 6 = 4; 2 x 5 = 10; 4 + 10 = 14." },
    { q: "In MDAS, 'M' and 'D' stand for:", options: ["Multiplication and Division", "Minus and Difference", "Measurement and Decimals"], a: "Multiplication and Division", hint: "First two operations in MDAS." },
    { q: "Evaluate: 10 x 10 - 50 ÷ 5", options: ["90", "10", "50"], a: "90", hint: "100 - 10 = 90." }
  ],
  8: [ // Medium: Unit Conversions (Length, Mass, Capacity, Time)
    { q: "Convert 3 meters to centimeters:", options: ["300 cm", "30 cm", "3,000 cm"], a: "300 cm", hint: "1 meter = 100 centimeters." },
    { q: "Convert 5 kilometers to meters:", options: ["5,000 m", "500 m", "50,000 m"], a: "5,000 m", hint: "1 kilometer = 1,000 meters." },
    { q: "Convert 4 kilograms to grams:", options: ["4,000 g", "400 g", "40,000 g"], a: "4,000 g", hint: "1 kilogram = 1,000 grams." },
    { q: "Convert 2 liters to milliliters:", options: ["2,000 mL", "200 mL", "20,000 mL"], a: "2,000 mL", hint: "1 liter = 1,000 milliliters." },
    { q: "How many seconds are in 3 minutes?", options: ["180 seconds", "120 seconds", "300 seconds"], a: "180 seconds", hint: "1 minute = 60 seconds (3 x 60)." },
    { q: "Convert 120 minutes to hours:", options: ["2 hours", "3 hours", "1 hour"], a: "2 hours", hint: "60 minutes = 1 hour." },
    { q: "How many days are in 4 weeks?", options: ["28 days", "30 days", "21 days"], a: "28 days", hint: "1 week = 7 days (4 x 7)." },
    { q: "Convert 2,000 grams to kilograms:", options: ["2 kg", "20 kg", "200 kg"], a: "2 kg", hint: "Divide by 1,000." },
    { q: "How many hours are in 2 days?", options: ["48 hours", "24 hours", "36 hours"], a: "48 hours", hint: "1 day = 24 hours (2 x 24)." },
    { q: "Convert 5000 milliliters to liters:", options: ["5 L", "50 L", "500 L"], a: "5 L", hint: "1,000 mL = 1 L." }
  ],
  9: [ // Medium: Fractions (Types, Rewriting, Plotting, Similar Addition/Subtraction)
    { q: "What type of fraction is 3/4?", options: ["Proper fraction", "Improper fraction", "Mixed number"], a: "Proper fraction", hint: "Numerator is smaller than denominator." },
    { q: "What type of fraction is 7/4?", options: ["Improper fraction", "Proper fraction", "Mixed number"], a: "Improper fraction", hint: "Numerator is larger than denominator." },
    { q: "Convert 7/4 to a mixed number:", options: ["1 3/4", "1 1/4", "2 1/4"], a: "1 3/4", hint: "7 ÷ 4 = 1 with remainder 3." },
    { q: "Convert 2 1/3 to an improper fraction:", options: ["7/3", "5/3", "6/3"], a: "7/3", hint: "(2 x 3) + 1 = 7." },
    { q: "Add similar fractions: 2/5 + 1/5 =", options: ["3/5", "3/10", "1/5"], a: "3/5", hint: "Add numerators, keep denominator." },
    { q: "Subtract similar fractions: 7/8 - 3/8 =", options: ["4/8", "4/0", "10/8"], a: "4/8", hint: "7 - 3 = 4 over 8." },
    { q: "Solve: 1 2/4 + 2 1/4 =", options: ["3 3/4", "3 1/4", "3 2/4"], a: "3 3/4", hint: "1+2 = 3; 2/4 + 1/4 = 3/4." },
    { q: "Subtract: 5 - 1/3 =", options: ["4 2/3", "4 1/3", "3 2/3"], a: "4 2/3", hint: "Rewrite 5 as 4 3/3, then subtract 1/3." },
    { q: "What is a fraction with a numerator equal to its denominator (e.g., 5/5)?", options: ["Equal to 1", "Proper fraction", "Zero"], a: "Equal to 1", hint: "Any non-zero number divided by itself equals 1." },
    { q: "Add: 3/10 + 4/10 =", options: ["7/10", "7/20", "1/10"], a: "7/10", hint: "3 + 4 = 7 over denominator 10." }
  ],
  10: [ // Medium: Factors, Multiples, and Simplifying Fractions
    { q: "What are the factors of 12?", options: ["1, 2, 3, 4, 6, 12", "2, 4, 6, 8, 10", "12, 24, 36"], a: "1, 2, 3, 4, 6, 12", hint: "Numbers that divide 12 completely." },
    { q: "Which of the following is a multiple of 8?", options: ["24", "18", "20"], a: "24", hint: "8 x 3 = 24." },
    { q: "Reduce 4/8 to simplest form:", options: ["1/2", "2/4", "1/4"], a: "1/2", hint: "Divide numerator and denominator by 4." },
    { q: "What is the Greatest Common Factor (GCF) of 12 and 18?", options: ["6", "3", "2"], a: "6", hint: "Largest factor common to both numbers." },
    { q: "Which fraction is equivalent to 1/3?", options: ["2/6", "2/3", "3/6"], a: "2/6", hint: "Multiply numerator and denominator by 2." },
    { q: "Reduce 6/9 to simplest form:", options: ["2/3", "1/3", "3/4"], a: "2/3", hint: "Divide both top and bottom by 3." },
    { q: "List the first three multiples of 5:", options: ["5, 10, 15", "1, 5, 10", "5, 15, 25"], a: "5, 10, 15", hint: "5x1, 5x2, 5x3." },
    { q: "Is 15 a factor or a multiple of 5?", options: ["Multiple", "Factor", "Neither"], a: "Multiple", hint: "5 x 3 = 15." },
    { q: "Simplify 10/20:", options: ["1/2", "2/5", "1/4"], a: "1/2", hint: "10 is half of 20." },
    { q: "Which number is a factor of every whole number?", options: ["1", "0", "2"], a: "1", hint: "Every number can be divided by 1." }
  ],

  // ==================== HARD LEVELS (11 - 15) ====================
  11: [ // Hard: Dissimilar Fractions (Addition and Subtraction)
    { q: "What do we call fractions with different denominators?", options: ["Dissimilar fractions", "Similar fractions", "Equivalent fractions"], a: "Dissimilar fractions", hint: "Bottom numbers are not the same." },
    { q: "Add dissimilar fractions: 1/2 + 1/4 =", options: ["3/4", "2/6", "2/4"], a: "3/4", hint: "Convert 1/2 to 2/4; then 2/4 + 1/4 = 3/4." },
    { q: "Subtract dissimilar fractions: 1/2 - 1/3 =", options: ["1/6", "2/6", "1/1"], a: "1/6", hint: "Common denominator is 6: 3/6 - 2/6 = 1/6." },
    { q: "Find the Least Common Denominator (LCD) of 1/3 and 1/4:", options: ["12", "7", "6"], a: "12", hint: "Least common multiple of 3 and 4." },
    { q: "Solve: 2/3 + 1/6 =", options: ["5/6", "3/9", "4/6"], a: "5/6", hint: "Convert 2/3 to 4/6; 4/6 + 1/6 = 5/6." },
    { q: "Solve: 3/4 - 1/2 =", options: ["1/4", "2/4", "1/2"], a: "1/4", hint: "Convert 1/2 to 2/4; 3/4 - 2/4 = 1/4." },
    { q: "Add mixed numbers with dissimilar fractions: 1 1/2 + 2 1/4 =", options: ["3 3/4", "3 2/6", "3 1/4"], a: "3 3/4", hint: "1+2 = 3; 2/4 + 1/4 = 3/4." },
    { q: "Solve: 2 1/3 - 1 1/6 =", options: ["1 1/6", "1 2/3", "1 1/3"], a: "1 1/6", hint: "Convert 1/3 to 2/6; 2 2/6 - 1 1/6 = 1 1/6." },
    { q: "What is the LCD of fractions with denominators 5 and 10?", options: ["10", "50", "15"], a: "10", hint: "10 is a multiple of 5." },
    { q: "Solve: 1/5 + 2/10 =", options: ["4/10", "3/15", "3/10"], a: "4/10", hint: "Convert 1/5 to 2/10; 2/10 + 2/10 = 4/10 (or 2/5)." }
  ],
  12: [ // Hard: Line Symmetry and Reflection
    { q: "A figure has line symmetry if it can be folded into two identical halves that coincide. What is this fold line called?", options: ["Line of symmetry", "Line of reflection", "Diagonal line"], a: "Line of symmetry", hint: "Divides a figure into matching mirror parts." },
    { q: "How many lines of symmetry does a regular square have?", options: ["4", "2", "8"], a: "4", hint: "Vertical, horizontal, and 2 diagonals." },
    { q: "How many lines of symmetry does a rectangle (non-square) have?", options: ["2", "4", "1"], a: "2", hint: "Vertical and horizontal only." },
    { q: "When an image is reflected across a line, the resulting image is called a:", options: ["Mirror image / Reflection", "Rotation", "Translation"], a: "Mirror image / Reflection", hint: "Flipped copy across a line." },
    { q: "A reflection combined with a translation along the line of reflection is called a:", options: ["Glide reflection", "Rotation", "Dilation"], a: "Glide reflection", hint: "Slide plus mirror flip." },
    { q: "How many lines of symmetry does a circle have?", options: ["Infinite", "4", "360"], a: "Infinite", hint: "Any line through its center creates equal halves." },
    { q: "Which capital letter has horizontal line symmetry?", options: ["H", "F", "G"], a: "H", hint: "Folds top to bottom evenly." },
    { q: "Which capital letter has vertical line symmetry?", options: ["A", "B", "P"], a: "A", hint: "Folds left to right evenly." },
    { q: "In reflection, the distance from an original point to the line of reflection is ___ the distance from the reflected point to the line.", options: ["Equal to", "Greater than", "Less than"], a: "Equal to", hint: "Mirror points are equidistant from the line." },
    { q: "Does a scalene triangle have any lines of symmetry?", options: ["No", "Yes, 1", "Yes, 3"], a: "No", hint: "All side lengths and angles are different." }
  ],
  13: [ // Hard: Tables, Line Graphs, and Data Interpretation
    { q: "Which graph is best used to show changes in data over a period of time?", options: ["Single line graph", "Bar graph", "Pie chart"], a: "Single line graph", hint: "Uses connected points to track trends over time." },
    { q: "In a line graph, what does the horizontal axis (X-axis) usually represent?", options: ["Time", "Quantity / Value", "Categories"], a: "Time", hint: "Days, months, years, or hours." },
    { q: "In a line graph, what does the vertical axis (Y-axis) usually represent?", options: ["Numerical data / Amounts", "Time periods", "Names of items"], a: "Numerical data / Amounts", hint: "Measures values or counts." },
    { q: "If a line graph slopes upwards from left to right, what does it indicate?", options: ["An increase over time", "A decrease over time", "No change"], a: "An increase over time", hint: "The values are going up." },
    { q: "Data arranged systematically in rows and columns is presented in a:", options: ["Tabular form / Table", "Line graph", "Pictograph"], a: "Tabular form / Table", hint: "Rows and columns format." },
    { q: "If a line on a line graph is completely horizontal, what does it mean?", options: ["The data remained constant", "The data increased rapidly", "The data dropped to zero"], a: "The data remained constant", hint: "No change took place." },
    { q: "What part of a graph explains what symbols, colors, or lines represent?", options: ["Legend / Key", "Title", "Axis"], a: "Legend / Key", hint: "Explains code/colors used." },
    { q: "What part of a graph gives a brief explanation of what the graph shows?", options: ["Title", "Scale", "Label"], a: "Title", hint: "Placed at the top of the graph." },
    { q: "A table shows temperatures recorded every hour from 8 AM to 12 PM. How many variables are tracked?", options: ["2 (Time and Temperature)", "1", "4"], a: "2 (Time and Temperature)", hint: "Time vs. Temperature." },
    { q: "What is used to connect data points in a line graph?", options: ["Line segments", "Curved waves", "Dotted circles"], a: "Line segments", hint: "Straight line lines connecting consecutive points." }
  ],
  14: [ // Hard: Simple Patterns and Number Sentences
    { q: "Describe the rule for the pattern: 4, 8, 12, 16, 20...", options: ["Add 4", "Multiply by 2", "Add 2"], a: "Add 4", hint: "Each term increases by 4." },
    { q: "Find the missing number in the pattern: 3, 9, 27, __, 243", options: ["81", "54", "36"], a: "81", hint: "Rule: Multiply by 3." },
    { q: "Complete the number sentence representing commutative property: 4 + 7 = 7 + __", options: ["4", "7", "11"], a: "4", hint: "Swapping order does not change the sum." },
    { q: "Complete the equivalent number sentence: 5 + __ = 3 + 7", options: ["5", "10", "2"], a: "5", hint: "3 + 7 = 10; 5 + 5 = 10." },
    { q: "What is the missing term: 100, 90, 80, __, 60?", options: ["70", "75", "65"], a: "70", hint: "Subtract 10 each time." },
    { q: "Complete the sentence showing associative property: (2 + 3) + 4 = 2 + (__ + 4)", options: ["3", "2", "4"], a: "3", hint: "Grouping changes, numbers remain the same." },
    { q: "Find the missing number: 6 x __ = 42", options: ["7", "6", "8"], a: "7", hint: "42 ÷ 6 = 7." },
    { q: "Describe the rule: 2, 4, 8, 16, 32...", options: ["Multiply by 2", "Add 2", "Add 4"], a: "Multiply by 2", hint: "Doubles each step." },
    { q: "Find the missing value in the balanced sentence: 15 - __ = 4 + 3", options: ["8", "7", "9"], a: "8", hint: "4 + 3 = 7; 15 - 8 = 7." },
    { q: "What is the next number in the pattern: 1, 4, 9, 16, __?", options: ["25", "20", "24"], a: "25", hint: "Square numbers: 1x1, 2x2, 3x3, 4x4, 5x5." }
  ],
  15: [ // Hard: Decimals (Place Value, Conversion, Plotting, Comparing, Rounding)
    { q: "In the decimal number 0.45, what is the place value of digit 5?", options: ["Hundredths", "Tenths", "Ones"], a: "Hundredths", hint: "Second position to the right of the decimal point." },
    { q: "Convert 0.7 to a fraction:", options: ["7/10", "7/100", "7/1"], a: "7/10", hint: "7 tenths = 7 over 10." },
    { q: "Convert 25/100 to a decimal:", options: ["0.25", "2.5", "0.025"], a: "0.25", hint: "Two decimal places for hundredths." },
    { q: "Compare: 0.6 ___ 0.45", options: [">", "<", "="], a: ">", hint: "0.60 is greater than 0.45." },
    { q: "Round 3.84 to the nearest whole number:", options: ["4", "3", "3.8"], a: "4", hint: "Tenths digit 8 is 5 or greater." },
    { q: "Round 2.47 to the nearest tenth:", options: ["2.5", "2.4", "3.0"], a: "2.5", hint: "Hundredths digit 7 rounds tenths digit 4 up to 5." },
    { q: "What is the value of 3 in 0.38?", options: ["0.3", "0.03", "3.0"], a: "0.3", hint: "3 tenths = 0.3." },
    { q: "On a number line between 0 and 1, where is 0.5 located?", options: ["Exactly in the middle", "Closer to 0", "Closer to 1"], a: "Exactly in the middle", hint: "0.5 equals one-half." },
    { q: "Convert 0.09 to a fraction:", options: ["9/100", "9/10", "9/1,000"], a: "9/100", hint: "Two places right of decimal = hundredths." },
    { q: "Order from smallest to largest: 0.12, 0.08, 0.5", options: ["0.08, 0.12, 0.5", "0.5, 0.12, 0.08", "0.12, 0.08, 0.5"], a: "0.08, 0.12, 0.5", hint: "Compare place values: 8 hundredths < 12 hundredths < 50 hundredths." }
  ]
};

export default grade4Math;