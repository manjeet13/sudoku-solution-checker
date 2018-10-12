/**
* @author : Manjeet Kumar
* @description : this function takes a sudoku solution and checks whether it is valid or not. This assumes that the solution sent is completely filled.
*/


module.exports = function validate_solution(solution_array) {
	//considering solution array is an array of arrays (somewhat like 2D matrix)
	/*	[
			[1,2,3,4,],
			[3,4,5,6],
		]
	the solution to this problem is done in 3 steps:
	1. validate rows
	2. validate colums
	3. validate each 3X3 region(box)
	*/

	let valid_row_flag = validate_row(solution_array);
	let valid_col_flag = validate_row(rotate_solution(solution_array));
	let valid_reg_flag = validate_row(regionize_solution(solution_array));

	return valid_row_flag && valid_col_flag && valid_reg_flag;
}

function validate_row(rows) {
	let row = rows[0];

	let validation_array = new Array(10);
	//get an array of length 10 with each value 0
	for(let index = 0; index < validation_array.length; ++i){
		validation_array[index] = 0;
	}

	//increment of validation array whenever an element of that index is found
	for(let i in row) {
		validation_array[row[i]]++;
	}
  if(check_elements(validation_array)) {
    if ( rows.length > 1 ) {
      var next_rows = rows.slice(1);
      return validate_rows( next_rows );
    }
  }

	//check each element from 1 to 9 occurs exactly once
	
	//if passed the loop, row is correct
	return true;
}



function check_elements(validation_array) {
  for(let i in validation_array)  {
    if(i==0) continue;
    else if(validation_array[i] != 1) {
      //wrong solution
      return false;
    }
  }
  return true;
}


//now rotate the solution array by 90 degrees to get columns as rows
function rotate_solution(rows) {
	return rows[0].map( function(column, index) {
    return rows.map( function(row) {
      return row[index];
    });
  });
}


//validate each 3X3 region by plucking out the values into an array of 9 elements (similar to a row)
function regionize_solution(rows) {
	return rows.map( function(row, index) {
    	return pluck_region(rows, index);
  });
}


pluck_region(board, index) {
	// Given an index from 0 to 8, we need to pluck out the corresponding region:
  /* _______________________
    | _ _ _ | _ _ _ | _ _ _ |
    | _ 0 _ | _ 1 _ | _ 2 _ |
    |_______|_______|_______|
    | _ _ _ | _ _ _ | _ _ _ |
    | _ 3 _ | _ 4 _ | _ 5 _ |
    |_______|_______|_______|
    | _ _ _ | _ _ _ | _ _ _ |
    | _ 6 _ | _ 7 _ | _ 8 _ |
    |_______|_______|_______|
  */
  // And return it as a row of its 9 numbers.

  // First, divide by 3, and floor it. This maps 0..9 to [0,0,0,1,1,1,2,2,2]
  var floored_starter_row = Math.floor(index / 3);

  // Then, simply enough, multiply by 3!
  var region_row          = floored_starter_row * 3;

  // Because we always want 3 rows, we can just slice from our row to row+3.
  var board_rows = board.slice(region_row, region_row+3);

  // We need to map 0..9 to [0,1,2,0,1,2,0,1,2]
  var normalized_col = index % 3

  // Now, once again, it's just a matter of multiplying by 3, for our desired
  // array of [0,3,6,0,3,6,0,3,6]
  var representative_col = normalized_col * 3

  // Map our rows to only grab the 3 values from each row we need, at the
  // columns requested
  var board_cells = board_rows.map( function(row) {
    return row.slice(representative_col, representative_col+3)
  });

  // At this point, we should indeed have a region! It's still a 2D array though.
  // Flatten it, so we can treat it as a regular row.
  return flatten(board_cells);
}


// Turn a multi-dimensional array like [ [1,1,1], [2,2,2], [3,3,3] ]
// into a single-dimension array like [ 1,1,1,2,2,2,3,3,3 ]
function flatten(arr) {
  // Reduce is lovely. It's akin to Ruby's inject.
  // For every item in array, perform this function on it; what you return
  // gets passed to the next iteration as 'memo'.
  // For the first iteration, 'memo' is an empty array, passed in as the
  // second argument below.
  return arr.reduce( function(memo, val) {
    // Concat is a very helpful builtin that either pushes a regular value
    // to an array, or 'concatenates' two arrays.
    // For example, [1, 2].concat([3, 4]) -> [1, 2, 3, 4]
    // This only works on 1D arrays; we can't just use this to flatten.
    // By recursively calling flatten on all arrays we find, that will eventually
    // return a 1D array, which we can concatenate =)
    return memo.concat(
      is_array(val) ? flatten(val) : val
    );
  }, []);
}


// Simple Array checker. Returns true if obj is an array.
function is_array(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}
