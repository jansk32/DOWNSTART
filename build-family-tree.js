// Data set for testing
export const family = [{
	id: 'th',
	gender: 'm',
	m: 'yb',
	f: 'ah'
}, {
	id: 'fh',
	gender: 'f',
	spouse: 'mg',
	m: 'yb',
	f: 'ah'
}, {
	id: 'mg',
	gender: 'm',
	spouse: 'fh'
}, {
	id: 'yb',
	gender: 'f',
	spouse: 'ah',
	m: 'pp',
	f: 'gg'
}, {
	id: 'vb',
	gender: 'f',
	spouse: 'tk',
	m: 'pp',
	f: 'gg'
}, {
	id: 'tk',
	gender: 'm',
	spouse: 'vb',
}, {
	id: 'j0',
	gender: 'm',
	m: 'vb',
	f: 'tk'
}, {
	id: 'j1',
	gender: 'f',
	m: 'vb',
	f: 'tk'
}, {
	id: 'j2',
	gender: 'f',
	m: 'vb',
	f: 'tk'
}, {
	id: 'lb',
	gender: 'f',
	spouse: 'ak',
	m: 'pp',
	f: 'gg'
}, {
	id: 'ak',
	gender: 'm',
	spouse: 'lb',
}, {
	id: 'ad',
	gender: 'm',
	m: 'lb',
	f: 'ak'
}, {
	id: 'nd',
	gender: 'f',
	m: 'lb',
	f: 'ak'
}, {
	id: 'ah',
	gender: 'm',
	spouse: 'yb',
	m: 'gm',
	f: 'gf'
}, {
	id: 'lh',
	gender: 'f',
	spouse: 'jk',
	f: 'gf',
	m: 'gm'
}, {
	id: 'jk',
	gender: 'm',
	spouse: 'lh'
}, {
	id: 'dh',
	gender: 'm',
	spouse: 'yh',
	m: 'gm',
	f: 'gf'
}, {
	id: 'yh',
	gender: 'f',
	spouse: 'dh'
}, {
	id: 'pp',
	gender: 'f',
	spouse: 'gg'
},
{
	id: 'gg',
	gender: 'm',
	spouse: 'pp'
},
{
	id: 'gm',
	gender: 'f',
	spouse: 'gf',
	f: 'ggf',
	m: 'ggm'
}, {
	id: 'ggf',
	gender: 'm',
	spouse: 'ggm'
}, {
	id: 'ggm',
	gender: 'f',
	spouse: 'ggf'
}, {
	id: 'gf',
	gender: 'm',
	spouse: 'gm'
},
];
const radius = 50;
const margin = 10;
const baseWidth = 6 * (radius + margin);
const verticalGap = 4 * (radius + margin);


// Recursively find the most distant ancestors of a certain individual
function up(family, divisibles, nonDivisibles) {
	// Base case: no one to divide
	if (divisibles.length === 0) {
		return nonDivisibles;
	}
	// Look for parents of the first element in divisibles
	const divisibleNode = divisibles[0];
	if (divisibleNode.f && divisibleNode.m) {
		// Can be further divided
		const father = family.find(node => node.id === divisibleNode.f);
		const mother = family.find(node => node.id === divisibleNode.m);
		father.tempGen = mother.tempGen = divisibleNode.tempGen - 1;
		divisibles.splice(0, 1, father, mother);
	} else {
		// Can't be divided anymore, record as most distant ancestor
		divisibles.splice(0, 1);
		nonDivisibles.push(divisibleNode);
	}
	return up(family, divisibles, nonDivisibles);
}

// Get the most distant ancestors of the target person
function getAncestors(family, targetId) {
	const node = family.find(person => person.id === targetId);
	node.tempGen = 0;
	return up(family, [node], []);
}

// Recursively find children of a person and also the children's children
function down(family, ancestors, results, parents) {
	if (parents.length === 0) {
		if (ancestors.length === 0) {
			// Base case: ancestors is empty and there are no more parents to resolve
			return results;
		}
		// Parents is empty, move an ancestor to parents
		parents.push(ancestors.shift());
	} else {
		// There are parents to resolve, split them into their children
		const parent = parents.shift();
		if (results.includes(parent)) {
			// Parent already registered, skip registering spouse and children
			return down(family, ancestors, results, parents);
		}
		// Register parent
		results.push(parent);
		// If spouse exists, register spouse too
		const spouseId = parent.spouse;
		if (spouseId) {
			const spouse = family.find(node => node.id === spouseId);
			spouse.gen = parent.gen;
			results.push(spouse);
			// Then look for children, add children to parents to check them as parents
			const children = family.filter(node => node.f === parent.id || node.m === parent.id);
			children.forEach(child => child.gen = parent.gen + 1);
			parents.unshift(...children);
		}
	}
	return down(family, ancestors, results, parents);
}

// Find all members of a family starting from the ancestors
function getDescendants(family, ancestors) {
	return down(family, ancestors, [], []);
}

/* Set the most distant ancestor's generation to 0
 * and everyone else's accordingly */
function normalizeAncestorGen(ancestors) {
	const offset = -Math.min(...ancestors.map(node => node.tempGen));
	ancestors.forEach(node => node.gen = node.tempGen + offset);
}

// Return a family tree object without SVG positions
function buildFamilyTree(family, id) {
	const ancestors = getAncestors(family, id);
	normalizeAncestorGen(ancestors);
	family.forEach(node => delete node.tempGen);
	const familyTree = getDescendants(family, ancestors);
	return familyTree;
}

// Assign SVG positions to each family member
function mainArrangeFamilyTree(familyTree, ancestors, targetId) {
	const targetPerson = familyTree.find(person => person.id === targetId);
	for (let ancestor of ancestors) {
		if (!('marriageOffset' in ancestor)) {
			ancestor.width = recursiveArrangeFamilyTree(familyTree, ancestor, targetPerson);
		}
	}
}

/* Recursively assign SVG positions to a person and their children,
 * then the children's children */
function recursiveArrangeFamilyTree(familyTree, node, targetPerson) {
	// Base case: no spouse
	if (!node.spouse) {
		return baseWidth;
	}
	const baseMarriageOffset = baseWidth / 4;

	// By default, marriageOffset is determined by gender
	// This is for father, mother, and everyone who is not in their generation
	node.marriageOffset = node.gender === 'm' ? -baseMarriageOffset : baseMarriageOffset;

	// But, if current parent is in the generation of the target person's parent:
	// and is sibling of father, put to the left in marriage
	// and is sibling of mother, put to the right in marriage
	// and is father or mother themself, ignore since it's been handled by the default case
	if (node.gen === targetPerson.gen - 1) {
		const father = familyTree.find(person => person.id === targetPerson.f);
		if (node.id !== father.id && node.f === father.f) {
			node.marriageOffset = -baseMarriageOffset;
		}
		const mother = familyTree.find(person => person.id === node.m);
		if (node.id !== mother.id && node.f === mother.f) {
			node.marriageOffset = baseMarriageOffset;
		}
	}

	const spouse = familyTree.find(spouse => spouse.id === node.spouse);
	spouse.marriageOffset = -node.marriageOffset;
	const children = familyTree.filter(child => child.f === node.id || child.m === node.id);
	// Base case: no children
	if (!children.length) {
		return baseWidth;
	}
	for (let child of children) {
		child.width = recursiveArrangeFamilyTree(familyTree, child, targetPerson);
	}

	// Manually reorder siblings if it's the target person's parent generation
	if (children[0].gen === targetPerson.gen - 1) {
		if (children.some(child => child.id === targetPerson.f)) {
			// Father's cluster, move father to the end
			children.push(children.splice(children.findIndex(child => child.id === targetPerson.f), 1)[0]);
		} else {
			// Mother's cluster, move mother to the start
			children.unshift(children.splice(children.findIndex(child => child.id === targetPerson.m), 1)[0]);
		}
	}
	children[0].xOffset = 0;
	for (let i = 1; i < children.length; i++) {
		children[i].xOffset = children[i - 1].xOffset + children[i - 1].width / 2 + children[i].width / 2;
	}

	// Shift children to the left
	const leftOffset = children[children.length - 1].xOffset / 2;
	console.log(children[0].id + ' ' + leftOffset);
	children.forEach(child => console.log(child.xOffset));
	children.forEach(child => child.xOffset -= leftOffset);
	const totalWidth = children.reduce((sum, child) => sum + child.width, 0);
	return totalWidth > baseWidth ? totalWidth : baseWidth;
}

// Assign x coordinates for each family member for drawing on SVG
function mainAssignX(familyTree, ancestors) {
	const initialAncestor = ancestors.splice(ancestors.findIndex(ancestor => ancestor.gen === 0), 1)[0];
	initialAncestor;
	initialAncestor.x = 0;
	assignX(familyTree, initialAncestor);

	for (let ancestor of ancestors) {
		// Boomerang (down and up) then waterfall (down)
		const traversedChild = mainFindTraversedChild(familyTree, ancestor);
		assignXUp(familyTree, traversedChild);

		assignX(familyTree, ancestor);
	}
}

// The passed node should already have its x assigned
function assignX(familyTree, node) {
	if (node.isTraversed || !node.spouse) {
		node.isTraversed = true;
		return;
	}
	const spouse = familyTree.find(spouse => spouse.id === node.spouse);
	spouse.x = node.x + spouse.marriageOffset - node.marriageOffset;
	const children = familyTree.filter(child => child.f === node.id || child.m === node.id);
	children.forEach(child => child.x = node.x - node.marriageOffset + child.xOffset);
	children.forEach(child => assignX(familyTree, child));
	node.isTraversed = true;
	spouse.isTraversed = true;
}

/* Find an already traversed child who has their x coordinate assigned so we can
 * assign x coordinates to the people who are connected to the child relative
 * to the child's x coordinate */
function mainFindTraversedChild(familyTree, node) {
	return findTraversedChild(familyTree, [node]);
}

function findTraversedChild(familyTree, parents) {
	// Breadth first, so add to the start
	// Base case: parents is empty -> failed to find any traversed child
	if (!parents.length) {
		return null;
	}
	const parent = parents.pop();

	// Base case: current node is traversed, return it
	if (parent.isTraversed) {
		return parent;
	}
	const children = familyTree.filter(child => child.f === parent.id || child.m === parent.id);
	parents.unshift(...children);
	return findTraversedChild(familyTree, parents);
}

// Assign x but don't set isTraversed to true
function assignXUp(familyTree, node) {
	// Base case: no parents
	if (!node.f || !node.m) {
		return;
	}
	const father = familyTree.find(parent => parent.id === node.f);
	const mother = familyTree.find(parent => parent.id === node.m);

	father.x = node.x - node.xOffset + father.marriageOffset;
	mother.x = node.x - node.xOffset + mother.marriageOffset;

	assignXUp(familyTree, father);
	assignXUp(familyTree, mother);
}


function shiftToFitScreen(familyTree) {
	const offset = -Math.min(...familyTree.map(node => node.x)) + radius + margin;
	familyTree.forEach(node => node.x += offset);
}

function assignY(familyTree) {
	familyTree.forEach(node => node.y = node.gen * verticalGap);
}

/* Accepts a family object and the id of the target person.
 * The family tree will be generated for people who are related by blood to 
 * the target person and their spouses.
 * Returns an object consisting of the family tree itself and ancestors 
 * of the target person (used for other functions) */
export default function generateFamilyTree(family, targetId) {
	const familyTree = buildFamilyTree(family, targetId);
	const ancestors = getAncestors(family, targetId);
	mainArrangeFamilyTree(familyTree, ancestors, targetId);
	console.log(familyTree.map(node => [node.id, node.xOffset]));
	mainAssignX(familyTree, ancestors);
	shiftToFitScreen(familyTree);
	assignY(familyTree);
	return { familyTree, ancestors };
}

// Create lines for family tree
export function mainDrawLines(familyTree, ancestors) {
	let lines = [];
	for (let ancestor of ancestors) {
		lines.push(...recursiveDrawLines(familyTree, ancestor));
	}
	console.log(lines);
	return lines;
}

function recursiveDrawLines(familyTree, node) {
	let lines = [];
	// Check for parents
	console.log('Looking at ' + node.id);
	if (node.f && node.m) {
		// If yes, draw vertical line up
		console.log('registering line');
		lines.push({
			x1: node.x,
			y1: node.y - radius,
			x2: node.x,
			y2: node.y - verticalGap / 2
		});
	}
	if (node.hasLines) {
		return lines;
	}
	// Check for spouse
	if (node.spouse) {
		lines.push({
			x1: node.x - radius * Math.sign(node.marriageOffset),
			y1: node.y,
			x2: node.x - node.marriageOffset,
			y2: node.y
		});

		const spouseNode = familyTree.find(person => person.id === node.spouse);
		lines.push({
			x1: spouseNode.x - radius * Math.sign(spouseNode.marriageOffset),
			y1: spouseNode.y,
			x2: spouseNode.x - spouseNode.marriageOffset,
			y2: spouseNode.y
		});
		spouseNode.hasLines = true;
	}
	// Check for kids
	const children = familyTree.filter(child => child.f === node.id || child.m === node.id);
	if (children.length) {
		// Draw single vertical line down for kids
		lines.push({
			x1: node.x - node.marriageOffset,
			y1: node.y,
			x2: node.x - node.marriageOffset,
			y2: node.y + verticalGap / 2
		});
		// Draw horizontal line to span all kids
		lines.push({
			x1: Math.min(...children.map(child => child.x)),
			y1: node.y + verticalGap / 2,
			x2: Math.max(...children.map(child => child.x)),
			y2: node.y + verticalGap / 2
		});
		// Recurse into each child
		for (let child of children) {
			lines.push(...recursiveDrawLines(familyTree, child));
		}
	}

	node.hasLines = true;
	return lines;
}