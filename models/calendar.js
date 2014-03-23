// This isn't technically a "model" in the persisted-to-the-database sense, however,
// this seemed like the best place to put the calendar base code as it's more than a
// helper and more than should really be in a route (read controller).

// Why did I decide to write my own calendar model and view? Because I've never done
// it before and it sounded like fun! Also the off-the-shelf components I could find
// were either tightly coupled to a specific library or overkill for what I wanted,
// like calendars for groupware etc.

var Calendar = function(year, month) {
  var calendar   = {},
      layout     = [],
      items      = {},
      date       = new Date(year, month, 1),
      dayNames   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      monthNames = ["January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"];

  calendar.addItem = function(dayOfMonth, item) {
    if(items[dayOfMonth]) {
      items[dayOfMonth].push(item);
    } else {
      items[dayOfMonth] = [item];
    }
  };

  // Get the raw nested array structure for weeks and days. Used to render the view.
  calendar.getLayout = function() {
    layout = [];

    var firstOfMonth     = date.getDay() + 1,
        numOfDaysInMonth = new Date(year, month + 1, 0).getDate(),
        dayOfMonth       = 1;

    // Get the number of weeks in the month (these will become rows) making sure to
    // include padding for the first day falling after Sunday (day index = 0).
    var weeksInMonth = Math.ceil((numOfDaysInMonth + firstOfMonth) / 7);

    // Iterate through each week
    for(var weekIndex = 1; weekIndex <= weeksInMonth; weekIndex++) {
      var week = [];

      // And each day
      for(var dayIndex = 1; dayIndex <= 7; dayIndex++) {
        dayOfMonth++;

        if(dayOfMonth > firstOfMonth && dayOfMonth < (numOfDaysInMonth + firstOfMonth + 1)) {
          week.push({
            date:  dayOfMonth - firstOfMonth,
            day:   dayNames[dayIndex - 1],
            items: items[dayOfMonth - firstOfMonth]
          });
        } else {
          week.push({});
        }
      }
      layout.push(week);
    }

    return layout;
  };

  // Get a user friendly date label in the format of "[month], [year]".
  calendar.getDateLabel = function() {
    return monthNames[date.getMonth()] + ", " + date.getFullYear();
  };

  return calendar;
};

module.exports = Calendar;
