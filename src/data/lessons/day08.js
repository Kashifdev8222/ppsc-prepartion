export const day08 = {
  id: 'day08',
  week: 2,
  title: 'Nouns and Pronouns',
  sections: [
    {
      heading: 'Today’s goal',
      paragraphs: [
        'In Day 1 you learned the 8 families of words. Now we go deep into the two most common families in PPSC tests: **nouns** and **pronouns**. Roughly 4–6 questions in every English paper come from these two.',
      ],
    },
    {
      heading: 'Types of nouns',
      bullets: [
        '**Proper noun** — a specific name, always with a capital letter: Lahore, Quaid-e-Azam, Ravi.',
        '**Common noun** — a general name: city, officer, river.',
        '**Collective noun** — a group as one unit: army, police, committee, team, family.',
        '**Abstract noun** — an idea or quality you cannot touch: honesty, bravery, freedom, justice.',
        '**Concrete noun** — something you can see or touch: table, uniform, road.',
        '**Countable** — you can count them: one officer, two officers, three files.',
        '**Uncountable** — you cannot count them one by one: water, information, advice, furniture.',
      ],
    },
    {
      heading: 'Singular and plural — the exam favourites',
      bullets: [
        'Most nouns add **-s**: book → books, officer → officers.',
        'Nouns ending in **s, ss, sh, ch, x, o** add **-es**: box → boxes, watch → watches, hero → heroes.',
        'Nouns ending in **-y** after a consonant change to **-ies**: city → cities, army → armies. (But: boy → boys, because -y follows a vowel.)',
        'Nouns ending in **-f / -fe** usually change to **-ves**: leaf → leaves, knife → knives.',
        '**Irregular plurals (memorise these):** child → children, man → men, woman → women, foot → feet, tooth → teeth, mouse → mice.',
        'Some nouns are the **same** in singular and plural: sheep, deer, series.',
      ],
    },
    {
      heading: 'Possessive form (apostrophe-s)',
      bullets: [
        'Singular: add **’s** — the officer’s cap (the cap of one officer).',
        'Plural ending in -s: add only **’** — the officers’ caps (the caps of many officers).',
        'Irregular plural: add **’s** — the children’s playground, the men’s room.',
        'The apostrophe here shows **possession (ownership)**, not plural.',
      ],
    },
    {
      heading: 'Pronouns — the five groups you must know',
      bullets: [
        '**Subject pronouns** (do the action): I, we, you, he, she, it, they. — "**They** patrol the city."',
        '**Object pronouns** (receive the action): me, us, you, him, her, it, them. — "The officer called **him**."',
        '**Possessive adjectives** (before a noun): my, our, your, his, her, its, their. — "This is **my** file."',
        '**Possessive pronouns** (stand alone): mine, ours, yours, his, hers, its, theirs. — "The file is **mine**."',
        '**Reflexive pronouns** (action returns to the subject): myself, yourself, himself, herself, itself, ourselves, yourselves, themselves. — "He hurt **himself**."',
        '**Demonstrative pronouns** (point at things): this, that, these, those.',
      ],
    },
    {
      heading: 'Two classic exam traps',
      bullets: [
        '**Trap 1:** after **to, for, with, at** use the OBJECT form. ✓ "The officer gave the file to **him**." ✗ "...to **he**."',
        '**Trap 2:** in compound subjects use the SUBJECT form. ✓ "**Ali and I** are going." ✗ "**Ali and me** are going." (Try removing "Ali and" — you would say "I am going", not "me am going".)',
      ],
    },
    {
      heading: 'Revision notes',
      note: 'Re-read the plural rules and the five pronoun groups tonight. Then attempt the quiz below without looking at the notes.',
    },
  ],
  mcqs: [
    {
      q: 'Which of the following is a collective noun?',
      options: ['soldier', 'committee', 'officer', 'child'],
      answer: 1,
      explain: 'A collective noun names a group as one unit — a committee is a group of people. Soldier, officer and child name single persons.',
    },
    {
      q: '"The committee has submitted its report." The noun "committee" is:',
      options: ['a proper noun', 'a collective noun', 'an abstract noun', 'an uncountable noun'],
      answer: 1,
      explain: 'A committee is a group of people treated as one unit, so it is a collective noun.',
    },
    {
      q: 'Which of the following is an abstract noun?',
      options: ['table', 'honesty', 'Lahore', 'child'],
      answer: 1,
      explain: 'Honesty is a quality you cannot see or touch, so it is an abstract noun. Table and child are concrete; Lahore is proper.',
    },
    {
      q: '"The officer works in Lahore." Which word is a proper noun?',
      options: ['officer', 'works', 'Lahore', 'in'],
      answer: 2,
      explain: 'Lahore is a specific place written with a capital letter, so it is a proper noun.',
    },
    {
      q: 'The plural of "child" is:',
      options: ['childs', 'childes', 'children', 'childrens'],
      answer: 2,
      explain: '"child" has an irregular plural: children. There is no extra -s.',
    },
    {
      q: 'The plural of "leaf" is:',
      options: ['leafs', 'leaves', 'leavies', 'leaf'],
      answer: 1,
      explain: 'Nouns ending in -f usually change to -ves: leaf → leaves (like knife → knives).',
    },
    {
      q: 'Which pronoun completes the sentence correctly? "Ali and ___ are going to the station."',
      options: ['me', 'I', 'my', 'mine'],
      answer: 1,
      explain: 'The blank is in the subject position (the doers of the action), so we need the subject pronoun "I".',
    },
    {
      q: '"This book is ___." Which word completes the sentence correctly?',
      options: ['my', 'me', 'mine', 'I'],
      answer: 2,
      explain: 'A possessive pronoun stands alone (no noun after it): "the book is mine". "My" needs a noun after it (my book).',
    },
    {
      q: '"She hurt herself while running." Which word is a reflexive pronoun?',
      options: ['She', 'hurt', 'herself', 'while'],
      answer: 2,
      explain: '"herself" reflects the action back to the subject "She" — it is a reflexive pronoun.',
    },
    {
      q: '"They enjoyed the picnic." Which word is a pronoun?',
      options: ['They', 'enjoyed', 'the', 'picnic'],
      answer: 0,
      explain: '"They" replaces a noun (a group of people), so it is a pronoun.',
    },
    {
      q: 'Which of the following is a demonstrative pronoun?',
      options: ['he', 'these', 'who', 'anyone'],
      answer: 1,
      explain: '"these" points at things (this, that, these, those), so it is a demonstrative pronoun.',
    },
    {
      q: '"The police officer gave the file to ___." Which word completes the sentence correctly?',
      options: ['he', 'him', 'his', 'himself'],
      answer: 1,
      explain: 'After the preposition "to" we use the object form: him. (Trap 1 from the lesson.)',
    },
    {
      q: 'Which of the following is an uncountable noun?',
      options: ['apple', 'water', 'chair', 'officer'],
      answer: 1,
      explain: 'You cannot count water one by one (no "two waters" in normal use), so it is uncountable.',
    },
    {
      q: '"The bravery of the soldiers impressed everyone." Which word is an abstract noun?',
      options: ['bravery', 'soldiers', 'impressed', 'everyone'],
      answer: 0,
      explain: 'Bravery is a quality you cannot touch, so it is an abstract noun.',
    },
    {
      q: '"The children’s playground" — the apostrophe shows:',
      options: ['plural', 'possession', 'contraction', 'past tense'],
      answer: 1,
      explain: 'The ’s after "children" shows ownership — the playground belongs to the children.',
    },
  ],
}
