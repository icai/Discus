/* 
 * Original Author: fnando 
 * see: https://github.com/fnando/i18n-js/blob/master/vendor/assets/javascripts/i18n.js
 */
// Instantiate the object
var I18n = I18n || {};

I18n.defaultLocale = "en-us", I18n.fallbacks = !1, I18n.defaultSeparator = ".", I18n.locale = null, I18n.PLACEHOLDER = /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm, I18n.pluralizationRules = {
en: rule = function(a) {
return a == 0 ? [ "zero", "none", "other" ] : a == 1 ? "one" : "other";
}
}, I18n.isValidNode = function(a, b, c) {
return a[b] !== null && a[b] !== c;
}, I18n.lookup = function(a, b) {
var b = b || {}, c = a, d = this.prepareOptions(I18n.translations), e = d[b.locale || I18n.currentLocale()], b = this.prepareOptions(b), f;
if (!e) return;
typeof a == "object" && (a = a.join(this.defaultSeparator)), b.scope && (a = b.scope.toString() + this.defaultSeparator + a), a = a.split(this.defaultSeparator);
while (a.length > 0) {
f = a.shift(), e = e[f];
if (!e) {
I18n.fallbacks && !b.fallback && (e = I18n.lookup(c, this.prepareOptions({
locale: I18n.defaultLocale,
fallback: !0
}, b)));
break;
}
}
return !e && this.isValidNode(b, "defaultValue") && (e = b.defaultValue), e;
}, I18n.prepareOptions = function() {
var a = {}, b, c = arguments.length;
for (var d = 0; d < c; d++) {
b = arguments[d];
if (!b) continue;
for (var e in b) this.isValidNode(a, e) || (a[e] = b[e]);
}
return a;
}, I18n.interpolate = function(a, b) {
b = this.prepareOptions(b);
var c = a.match(this.PLACEHOLDER), d, e, f;
if (!c) return a;
for (var g = 0; d = c[g]; g++) f = d.replace(this.PLACEHOLDER, "$1"), e = b[f], this.isValidNode(b, f) || (e = "[missing " + d + " value]"), regex = new RegExp(d.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}")), a = a.replace(regex, e);
return a;
}, I18n.translate = function(a, b) {
b = this.prepareOptions(b);
var c = this.lookup(a, b);
try {
return typeof c == "object" ? typeof b.count == "number" ? this.pluralize(b.count, a, b) : c : this.interpolate(c, b);
} catch (d) {
return this.missingTranslation(a);
}
}, I18n.localize = function(a, b) {
switch (a) {
case "currency":
return this.toCurrency(b);
case "number":
return a = this.lookup("number.format"), this.toNumber(b, a);
case "percentage":
return this.toPercentage(b);
default:
return a.match(/^(date|time)/) ? this.toTime(a, b) : b.toString();
}
}, I18n.parseDate = function(a) {
var b, c;
if (typeof a == "object") return a;
b = a.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?(Z|\+0000)?/);
if (b) {
for (var d = 1; d <= 6; d++) b[d] = parseInt(b[d], 10) || 0;
b[2] -= 1, b[7] ? c = new Date(Date.UTC(b[1], b[2], b[3], b[4], b[5], b[6])) : c = new Date(b[1], b[2], b[3], b[4], b[5], b[6]);
} else typeof a == "number" ? (c = new Date, c.setTime(a)) : a.match(/\d+ \d+:\d+:\d+ [+-]\d+ \d+/) ? (c = new Date, c.setTime(Date.parse(a))) : (c = new Date, c.setTime(Date.parse(a)));
return c;
}, I18n.toTime = function(a, b) {
var c = this.parseDate(b), d = this.lookup(a);
return c.toString().match(/invalid/i) ? c.toString() : d ? this.strftime(c, d) : c.toString();
}, I18n.strftime = function(a, b) {
var c = this.lookup("date");
if (!c) return a.toString();
c.meridian = c.meridian || [ "AM", "PM" ];
var d = a.getDay(), e = a.getDate(), f = a.getFullYear(), g = a.getMonth() + 1, h = a.getHours(), i = h, j = h > 11 ? 1 : 0, k = a.getSeconds(), l = a.getMinutes(), m = a.getTimezoneOffset(), n = Math.floor(Math.abs(m / 60)), o = Math.abs(m) - n * 60, p = (m > 0 ? "-" : "+") + (n.toString().length < 2 ? "0" + n : n) + (o.toString().length < 2 ? "0" + o : o);
i > 12 ? i -= 12 : i === 0 && (i = 12);
var q = function(a) {
var b = "0" + a.toString();
return b.substr(b.length - 2);
}, r = b;
return r = r.replace("%a", c.abbr_day_names[d]), r = r.replace("%A", c.day_names[d]), r = r.replace("%b", c.abbr_month_names[g]), r = r.replace("%B", c.month_names[g]), r = r.replace("%d", q(e)), r = r.replace("%e", e), r = r.replace("%-d", e), r = r.replace("%H", q(h)), r = r.replace("%-H", h), r = r.replace("%I", q(i)), r = r.replace("%-I", i), r = r.replace("%m", q(g)), r = r.replace("%-m", g), r = r.replace("%M", q(l)), r = r.replace("%-M", l), r = r.replace("%p", c.meridian[j]), r = r.replace("%S", q(k)), r = r.replace("%-S", k), r = r.replace("%w", d), r = r.replace("%y", q(f)), r = r.replace("%-y", q(f).replace(/^0+/, "")), r = r.replace("%Y", f), r = r.replace("%z", p), r;
}, I18n.toNumber = function(a, b) {
b = this.prepareOptions(b, this.lookup("number.format"), {
precision: 3,
separator: ".",
delimiter: ",",
strip_insignificant_zeros: !1
});
var c = a < 0, d = Math.abs(a).toFixed(b.precision).toString(), e = d.split("."), f, g = [], h;
a = e[0], f = e[1];
while (a.length > 0) g.unshift(a.substr(Math.max(0, a.length - 3), 3)), a = a.substr(0, a.length - 3);
h = g.join(b.delimiter), b.precision > 0 && (h += b.separator + e[1]), c && (h = "-" + h);
if (b.strip_insignificant_zeros) {
var i = {
separator: new RegExp(b.separator.replace(/\./, "\\.") + "$"),
zeros: /0+$/
};
h = h.replace(i.zeros, "").replace(i.separator, "");
}
return h;
}, I18n.toCurrency = function(a, b) {
return b = this.prepareOptions(b, this.lookup("number.currency.format"), this.lookup("number.format"), {
unit: "$",
precision: 2,
format: "%u%n",
delimiter: ",",
separator: "."
}), a = this.toNumber(a, b), a = b.format.replace("%u", b.unit).replace("%n", a), a;
}, I18n.toHumanSize = function(a, b) {
var c = 1024, d = a, e = 0, f, g;
while (d >= c && e < 4) d /= c, e += 1;
return e === 0 ? (f = this.t("number.human.storage_units.units.byte", {
count: d
}), g = 0) : (f = this.t("number.human.storage_units.units." + [ null, "kb", "mb", "gb", "tb" ][e]), g = d - Math.floor(d) === 0 ? 0 : 1), b = this.prepareOptions(b, {
precision: g,
format: "%n%u",
delimiter: ""
}), a = this.toNumber(d, b), a = b.format.replace("%u", f).replace("%n", a), a;
}, I18n.toPercentage = function(a, b) {
return b = this.prepareOptions(b, this.lookup("number.percentage.format"), this.lookup("number.format"), {
precision: 3,
separator: ".",
delimiter: ""
}), a = this.toNumber(a, b), a + "%";
}, I18n.pluralizer = function(a) {
return pluralizer = this.pluralizationRules[a], pluralizer !== undefined ? pluralizer : this.pluralizationRules.en;
}, I18n.findAndTranslateValidNode = function(a, b) {
for (i = 0; i < a.length; i++) {
key = a[i];
if (this.isValidNode(b, key)) return b[key];
}
return null;
}, I18n.pluralize = function(a, b, c) {
var d;
try {
d = this.lookup(b, c);
} catch (e) {}
if (!d) return this.missingTranslation(b);
var f;
return c = this.prepareOptions(c), c.count = a.toString(), pluralizer = this.pluralizer(this.currentLocale()), key = pluralizer(Math.abs(a)), keys = typeof key == "object" && key instanceof Array ? key : [ key ], f = this.findAndTranslateValidNode(keys, d), f == null && (f = this.missingTranslation(b, keys[0])), this.interpolate(f, c);
}, I18n.missingTranslation = function() {
var a = '[missing "' + this.currentLocale(), b = arguments.length;
for (var c = 0; c < b; c++) a += "." + arguments[c];
return a += '" translation]', a;
}, I18n.currentLocale = function() {
return I18n.locale || I18n.defaultLocale;
}, I18n.t = I18n.translate, I18n.l = I18n.localize, I18n.p = I18n.pluralize;

var I18n = I18n || {};

I18n.translations = {
"en-us": {
hover_box: {
video_game_platforms: "Platforms: {{platforms}}",
video_game_rating: "Rated {{rating}}",
video_game_release_date: "In stores {{date}}"
},
Error: {
error_500_title: "There was an error on this page (500 error)",
error_500_message: "Sorry - we've encountered an unexpected error. We've been notified about this issue and we'll take a look at it shortly.",
error_404_title: "The page you were looking for doesn't exist (404 error)",
error_404_message: "Sorry - we couldn't find the page you were looking for. You may have mistyped the address or the page may have moved."
},
adzone: {
share_title: "Toyota AdZone on Hulu",
share_desc: "Watch the the biggest ads of the year and take a look back at the best of years past in the Hulu AdZone. Share and vote for your favorites.",
ad_share_title: "Toyota AdZone on Hulu | %{title}",
ad_share_desc: "Watch the %{title} Super Bowl ad",
vote: "Vote for this ad"
},
browser_upgrader: {
browser_not_support: "Sorry, we no longer support your version of %{browser}.",
browser_recommend_upgrade: "%{browser} %{version} is no longer supported. To get the best possible experience on Hulu we recommend that you upgrade your browser.",
browser_click_download: "Just click on an icon to get to the download page.",
ie_name: "Internet Explorer",
chrome_name: "Chrome",
firefox_name: "Firefox",
url_ie8: "http://windows.microsoft.com/en-US/internet-explorer/downloads/ie-8",
url_ie9: "http://windows.microsoft.com/en-US/internet-explorer/downloads/ie-9/worldwide-languages",
url_chrome: "http://www.google.com/chrome",
url_ff: "http://www.mozilla.com/firefox/"
},
buttons: {
close: "close",
add_to_favorites: "Add to Favorites",
add_to_queue: "Add to Queue",
remove_from_favorites: "Remove from Favorites",
remove_from_queue: "Remove from Queue"
},
date: {
formats: {
"default": "%Y-%m-%d",
"short": "%b %d",
"long": "%B %d, %Y",
year_month: "%B %Y"
},
day_names: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
abbr_day_names: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
day_with_name: "%{day}",
month_names: [ null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
abbr_month_names: [ null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
year_with_name: "%{year}",
order: [ "year", "month", "day" ]
},
time: {
formats: {
"default": "%a, %d %b %Y %H:%M:%S %z",
"short": "%d %b %H:%M",
"long": "%B %d, %Y %H:%M",
date: "%B %d, %Y",
date_short: "%m/%d/%Y"
},
am: "am",
pm: "pm"
},
datetime: {
prompts: {
year: "Year",
month: "Month",
day: "Day",
hour: "Hour",
minute: "Minute",
second: "Seconds"
}
},
face_pile: {
name_format: "%{first_name} %{last_name}",
one_friend: "%{friend0}",
two_friends: "%{friend0} and %{friend1}",
three_friends: "%{friend0}, %{friend1} and %{friend2}",
more_than_three_friends: "%{friend0} and %{count} friends",
friends_on_video: "<div class='friends-text'>%{friends}</div><div class='on-video-text'>also watched this video</div>",
friends_on_show: "<div class='friends-text'>%{friends}</div><div class='on-show-text'>%{action} this show</div>"
},
filter: {
popularity: {
thisweek: "Popular This Week",
today: "Popular Today",
month: "Popular This Month",
all: "Popular All Time"
},
sortby: {
relevance: "Relevance",
airdate: "Air Date",
recentlyadded: "Recently Added",
populartoday: "Popular Today",
popularall: "Popular All Time",
userrating: "User Rating"
},
video_types: {
shows: "SHOWS",
episodes: "EPISODES",
clips: "CLIPS",
films: "MOVIES",
trailers: "TRAILERS",
movies: "MOVIES"
},
wyw: {
"default": "Suggested",
recentlywatched: "Recently Watched"
},
option_types: {
cc: "CC",
hd: "HD",
free: "Free"
},
no_results: "Sorry, we can't find a match for you. Please try again.",
no_recommended_shows: "We currently do not have any other shows to recommend. Please check back later.",
no_live_streams: "More live events are coming soon. Please check again another time."
},
global_message_banner: {
upgrade_browser: {
title: "Sorry, your version of Internet Explorer is no longer supported.",
message: "Internet Explorer %{version} is no longer supported. Please upgrade your browser.",
btn_text: "Upgrade Internet Explorer"
},
check_hold: {
title: "Your Hulu Plus subscription is On Hold",
message: "We're having a problem charging your credit card.  To reactivate your subscription please update your credit card information.",
btn_text: "Update Credit Card"
}
},
head_data: {
page_title: {
default_free: "Watch TV. Watch Movies. | Online | Free | Hulu",
default_subscriber: "Watch TV and movies on Xbox, PS3, Apple TV, and more | Hulu Plus"
},
meta_desc: {
default_free: "Watch TV shows and movies free online. Stream episodes of The Office, Glee, Family Guy, SNL and many more hit shows.",
default_subscriber: "Watch current hit TV shows and acclaimed movies. Unlimited streaming available on Xbox, PS3, Apple TV, and many other devices. Try it free."
}
},
header: {
browse: "BROWSE",
tv: "TV",
popular: "Popular",
"new": "Recently Added",
genres: "Genres",
networks: "Networks",
movies: "MOVIES",
trailers: "Trailers",
documentaries: "Documentaries",
criterion: "Criterion",
studios: "Studios",
latino: "Latino",
kids: "Kids",
video_games: "Video Games",
recommendations: "Recommendations",
picks: "Staff Picks",
huluplus: "Hulu Plus",
gift_cards: "Gift Cards",
referrals: "Get 2 Weeks Free",
socialon: "Social On",
socialoff: "Social Off",
account: "Account",
help: "Help",
logout: "Logout",
login: "Log In",
signup: "Sign Up",
subnav: {
popular: "Popular",
"new": "Recently Added",
genres: "Genres",
picks: "Staff Picks",
networks: "Networks",
trailers: "Trailers",
documentaries: "Documentaries",
criterion: "Criterion",
studios: "Studios"
},
queue_count: "Queue (%{count})",
favorites: "Favorites",
logo: "Logo",
season: "SEASON:",
all: "ALL"
},
live: {
key_art_url: "http://assets.huluim.com/live-streams/keyart_s1_1600x600.jpg",
start_at_prefix: "Stream Begins: ",
duration_prefix: "Estimated Length: ",
reminder: "remind me: ",
live_now: "LIVE NOW",
share_title: "Hulu - Live Streams Lounge",
share_link: "http://www.hulu.com/live?id=%{id}",
share_generic_thumb: "http://assets.huluim.com/spotlight/spotlight-livestream.jpg",
share_generic_text: "Check out Hulu's Live Events page, your destination for live performances, breaking news, and more.",
facebook: {
live: "Watching live: %{title} on Hulu - www.hulu.com/live?id=%{id}",
upcoming: "Come to hulu to watch live: %{title} at %{time} on %{date} - www.hulu.com/live?id=%{id}"
},
twitter: {
live: "Watching live: %{title} on @Hulu: ",
upcoming: "Come to @hulu to watch live: %{title} at %{time} on %{date}: "
},
calendar_image: {
alt: "Download a calendar entry for this event",
title: "Download a calendar entry for this event"
},
reminder_email: {
title: "Get a Reminder",
description: "Don't want to miss this live stream? We'll email you a reminder roughly 12 hours before it begins."
}
},
login: {
recommended: "(Recommended)",
hululogin: "Log in to Hulu",
forgot: "Forgot your password/email?",
email: "email",
password: "password",
login: "Log in",
createaccount: "Create Your Hulu Account",
emailaddress: "Email Address:",
createpassword: "Create Password:",
confirmpassword: "Confirm Password:",
dateofbirth: "Date of Birth:",
day: "Day",
month: "Month",
year: "Year",
gender: "Gender:",
male: "Male",
female: "Female",
existing: "Existing account",
mergecontinue: "Looks like you already have a Hulu account. To continue, please enter your Hulu credentials.",
enterpassword: "Please enter a password.",
passwordmismatch: "The passwords you entered do not match.",
invalid: "Your login is invalid. Please try again.",
enterboth: "Please enter both your email and password.",
no_cookies: "Please %{open_tag}enable cookies%{close_tag} and try again.",
intlwarning: "Sorry, currently our video library can only be watched from within the United States",
intlmessage: "Hulu is committed to making its content available worldwide. To do so, we must work through a number of legal and business issues, including obtaining international streaming rights. Know that we are working to make this happen and will continue to do so. Given the international background of the Hulu team, we have both a professional and personal interest in bringing Hulu to a global audience.",
cancel: "Cancel",
submit: "Submit",
verify_pass: "To view this page, please re-enter your password",
forgot_pass_title: "Forgot your password?<br/> We've sent a link to '%{email}'.",
forgot_pass_msg: "Please use this link to create a new password.  If you don't see this email in your inbox within 15 minutes, look for it in your junk-mail folder.  If you find it there, please mark the email as Not Junk and add @hulu.com to your address book."
},
masthead: {
share_facebook: "Share on Facebook",
share_twitter: "Share on Twitter",
add_to_queue: "Add to Queue",
queued: "Queued"
},
oscars: {
share_title: "Hulu - 2013 Oscar Watch",
facebook: {
thumb: "http://assets.huluim.com/spotlight/2013/facebook_share_thumb_oscars.jpg",
text: "Vote on who you think will take home the golden prize. We've got our own picks - what are yours? Let the race begin!"
},
twitter: {
text: "Who will the winners be this year at the #Oscars? Vote on your picks with Hulu's 2013 Oscars Ballot: "
},
voting: {
share_title: "Vote for %{category}",
facebook: {
text: "I voted for %{vote} to win %{category} in Hulu's 2013 Oscars Ballot"
}
},
social_callout: "Watch the #Oscars with Hulu: Follow @Hulu on Twitter for live award show coverage.",
questions: {
"13": {
category: "Best Cinematography",
choices: {
"1": "Life of Pi",
"2": "Anna Karenina",
"3": "Django Unchained",
"4": "Lincoln",
"5": "Skyfall"
}
},
"14": {
category: "Best Film Editing",
choices: {
"1": "Argo",
"2": "Life of Pi",
"3": "Lincoln",
"4": "Silver Linings Playbook",
"5": "Zero Dark Thirty"
}
},
"15": {
category: "Best Makeup",
choices: {
"1": "Hitchock",
"2": "The Hobbit: An Unexpected Journey",
"3": "Les Misérables"
}
},
"16": {
category: "Best Documentary Short",
choices: {
"1": "Inocente",
"2": "Kings Point",
"3": "Mondays at Racine",
"4": "Open Heart",
"5": "Redemption"
}
},
"17": {
category: "Best Music (Original Score)",
choices: {
"1": "Anna Karenina",
"2": "Argo",
"3": "Life of Pi",
"4": "Lincoln",
"5": "Skyfall"
}
},
"18": {
category: "Best Music (Original Song)",
choices: {
"1": '"Before My Time," Chasing Ice',
"2": '"Everybody Needs a Best Friend," Ted',
"3": '"Pi\'s Lullaby," Life of Pi',
"4": '"Skyfall," Skyfall',
"5": '"Suddenly," Les Misérables'
}
},
"19": {
category: "Best Production Design",
choices: {
"1": "Anna Karenina",
"2": "The Hobbit: An Unexpected Journey",
"3": "Les Misérables",
"4": "Life of Pi",
"5": "Lincoln"
}
},
"20": {
category: "Best Short Film (Animated)",
choices: {
"1": "Adam and Dog",
"2": "Fresh Guacamole",
"3": "Head Over Heels",
"4": 'Maggie Simpson in "The Longest Daycare"',
"5": "Paperman"
}
},
"21": {
category: "Best Short Film (Live Action)",
choices: {
"1": "ASAD",
"2": "Buzkashi Boys",
"3": "Curfew",
"4": "Death of a Shadow",
"5": "Henry"
}
},
"22": {
category: "Best Sound Mixing",
choices: {
"1": "Argo",
"2": "Les Misérables",
"3": "Life of Pi",
"4": "Lincoln",
"5": "Skyfall"
}
},
"23": {
category: "Best Sound Editing",
choices: {
"1": "Argo",
"2": "Django Unchained",
"3": "Life of Pi",
"4": "Skyfall",
"5": "Zero Dark Thirty"
}
},
"24": {
category: "Best Visual Effects",
choices: {
"1": "The Hobbit: An Unexpected Journey",
"2": "Life of Pi",
"3": "Marvel's The Avengers",
"4": "Prometheus",
"5": "Snow White and the Huntsman"
}
}
}
},
partners: {
ie9: {
menu_name: "Hulu",
history: "History",
movies: "Movies",
movie_trailers: "Movie Trailers",
documentaries: "Documentaries",
popular: "Popular",
queue: "Queue",
recently_added: "Recently Added",
favorites: "Favorites",
friends: "Friends",
tv: "TV",
free_plus: "Home",
advanced_search: "Advanced Search",
playlists: "Playlists"
}
},
plus: {
upsell: {
title: "Unlimited Instant Streaming",
subtitle: "Watch hit TV shows and movies anytime, anywhere.",
adzone: "Start watching Super Bowl ads now"
}
},
search: {
more_results: "More Results",
search_for: "Search for",
tabs: {
all: "ALL RESULTS",
episodes: "TV EPISODES",
movies: "MOVIES",
clips: "CLIPS"
},
promo: {
have_no_right: "We currently don't have the rights"
}
},
season_grid: {
add_all_to_queue: "Add All to Queue",
all_added_to_queue: "All Added to Queue",
all_free_added_to_queue: "All Free Videos Added to Queue",
remove_all_from_queue: "Remove All from Queue"
},
shelf: {
season_episode_filter: {
all_seasons: {
one: "All Seasons (1 Episode)",
other: "All Seasons ({{count}} Episodes)"
},
season_number: {
one: "Season {{seasonNumber}} (1 Episode)",
other: "Season {{seasonNumber}} ({{count}} Episodes)"
}
},
season_clip_filter: {
all_seasons: {
one: "All Seasons (1 Clip)",
other: "All Seasons ({{count}} Clips)"
},
season_number: {
one: "Season {{seasonNumber}} (1 Clip)",
other: "Season {{seasonNumber}} ({{count}} Clips)"
}
}
},
show: {
more: "more",
hide: "hide",
request_plus_content: "Thanks for your interest. We will continue to try to obtain the rights to stream this program in Hulu Plus.",
check_out_message: "Check out {{showname}} on @hulu: "
},
signup: {
news_notify: "Receive email updates on latest Hulu news and features.",
agree_to_tou_pp: 'I agree to the <a href="/terms" target="_blank" class="blue-link" tabindex="-1">Terms of Use</a> and <a href="/privacy" target="_blank" class="blue-link" tabindex="-1">Privacy Policy</a>',
agree_to_tou_account: 'By clicking %{submit_button_text}, you agree to the <a href="/terms" target="_blank" class="blue-link" tabindex="-1">Hulu Terms of Use</a> and <a href="/privacy" target="_blank" class="blue-link" tabindex="-1">Privacy Policy</a>.',
birth_month: "Month I was born",
optional: "(optional)",
male: "I'm male",
female: "I'm female",
why_payment_desc: "We ask for your payment information so you can enjoy Hulu Plus uninterrupted after your free trial ends",
protected_desc: "Hulu protects your information with industry-leading security and fraud protection systems.",
security_code_desc: "MasterCard, Visa and Discover security codes are located on the back of the card and are typically a separate group of 3 digits to the right of the signature strip.<br/><br/>American Express security codes are 4 digits located on the front of the card and usually towards the right.",
upgrade_to_plus: "Upgrade to Hulu Plus now",
start_gift_subscription: "Start your Hulu Plus gift subscription now",
confirm_payment_info: "Please confirm your payment information",
after_account: "Congratulations! You’ve successfully created your free Hulu account.",
require_payment: "Hulu requires payment information at sign up to prevent abuse of the free trial.",
absolutely_no_fee: "Absolutely NO fees during the free trial.",
payment_info: "Payment Information",
parental_consent: "Since I'm under 18, I've checked with my parent and I have permission to register with Hulu.",
support_info: "Call us at %{number}, between %{hours}.  %{status}.",
loading: "Loading...",
top: {
title: "",
desc: "",
in_case: "",
watch_tour: "",
either_fb: "You can either...",
facebook_prompt: "Sign Up Using Facebook",
facebook_msg: "Recommended: share videos you love with friends and see what they're watching.",
tell_us: "Or tell us about yourself..."
},
questions: {
title: "Questions?",
more_questions: "More Questions?",
time: "",
phone: ""
},
buttons: {
create_account: "Create Account",
"continue": "Continue",
done: "Done",
cancel_signup: "Cancel signup",
try_plus: "Upgrade: Try it Free &#9656;",
no_thanks: "No, Thanks. Start Watching."
},
not_eligible_warning: {
title: "Sorry, you are not eligible for this promotion.",
description: "Each user is only eligible for one free trial.  Since you have already participated in a Hulu free trial, we are unable to offer you another one at this time.  You will be charged $%{price} starting today.",
button: "Signup without free trial"
},
messages: {
ntmy: "Nice to meet you!",
email_desc: "You'll use this to log in",
what_is_this: "What is this?",
promo_code: "No promo code? Leave blank.",
protected_hover: "You are protected.",
why_payment: "Why do you need my card?"
},
fields_name: {
email: "Email",
email_confirmation: "Confirm Email",
first_name: "First Name",
last_name: "Last Name",
password: "Password",
password_confirmation: "Confirm Password",
card_number: "Card Number",
expiration_month: "Expiration Month",
security_code: "Security Code",
phone: "Phone Number",
zip: "Zip Code",
promotion_code: "Promo Code",
activation_code: "Activation Code",
billing_address_1: "Street Address",
billing_address_2: "Apt, Suite, Bldg. (optional)"
},
errors: {
email_invalid: "The email address is invalid",
email_used: 'It looks like you already have a Hulu account.<br/>Please <a id="email-used-login" class="blue-link">sign in</a>. Forgot your <a id="email-used-forgot-password" class="blue-link">password?</a>',
pl_enter_pw: "Please enter a password",
pl_enter_email: "Please enter your email address",
pl_enter_valid_email: "Please enter a valid email address",
pl_ensure_email_match: "Please make sure email and email confirmation are the same",
password_not_matched: "Passwords don't match",
password_length_error: "Please enter a password",
password_has_SBC: "Password includes full width character, please remove and try again",
password_please_confirm: "Please confirm your password",
password_enter_and_confirm: "Please enter and confirm your password",
login_password_has_SBC: "Password includes full width character",
pl_enter_gender: "Please select your gender",
pl_enter_first_name: "Please enter your first name",
pl_enter_last_name: "Please enter your last name",
pl_enter_name: "Please enter your first and last name",
pl_enter_parental_consent: "You must indicate you have permission from your parent (above).",
pl_enter_card: "Please enter your card number",
invalid_card_number: "Invalid Card Number",
pl_enter_expiration_year: "Please enter a valid year of expiration",
pl_enter_expiration_month: "Please enter a valid month of expiration",
pl_enter_expiration: "Please enter a valid expiration date",
pl_enter_security: "Please enter a valid security code. </br> <span class='origin hover-predefined' data-lazy='0' data-item-type='predefined' data-predefined-id='security-code-hover' data-default-orient='east' data-no-invert='1'>What is this?</span>",
pl_enter_expiration_year_and_security: "Please enter a valid year of expiration </br> and security code. <span class='origin hover-predefined' data-lazy='0' data-item-type='predefined' data-predefined-id='security-code-hover' data-default-orient='east' data-no-invert='1'>What is this?</span>",
pl_enter_expiration_month_and_security: "Please enter a valid month of expiration </br> and security code. <span class='origin hover-predefined' data-lazy='0' data-item-type='predefined' data-predefined-id='security-code-hover' data-default-orient='east' data-no-invert='1'>What is this?</span>",
pl_enter_expiration_and_security: "Please enter a valid expiration date </br> and security code. <span class='origin hover-predefined' data-lazy='0' data-item-type='predefined' data-predefined-id='security-code-hover' data-default-orient='east' data-no-invert='1'>What is this?</span>",
pl_valid_expiration: "Invalid Expiration Date",
pl_enter_street_address: "Please enter a valid street address",
pl_enter_zip: "Please enter your zip code",
pl_valid_zip: "Invalid Zip Code",
pl_enter_birthday: "Please enter your full birthday",
birthday_too_young: "You must be at least 13 years old to signup.",
age_lockout: "We're sorry, you are ineligible to create an account.",
pl_enter_both_pw_email: "Please enter both your email and password",
pl_agree: "Please agree to the Terms of Use and Privacy Policy",
payment_disable: "Sorry, our system is currently under maintenance and cannot process your request. Please check back in an hour or contact our customer service.",
email_in_jp: "This email is already registered in www.hulu.jp.<br/>Please try another one",
promotion_ineligible: "We're sorry, it looks like you are ineligible for a promotion. You can still signup for Hulu Plus though.",
session_expired: "Sorry, your session has expired."
},
program_detail: {
link_text: "",
desc: "",
free_period: "",
period_detail: "",
after_free: "",
after_detail: ""
},
upsell: {
upgrade: "Upgrade to watch full seasons, in your living room and on the go.",
faq: "Frequently Asked Questions",
content_link: "What content does Hulu Plus have?",
content_desc: "Hulu Plus features current hit TV shows, classic series and acclaimed movies. Watch any current season episode of Community, Modern Family, The Following, New Girl, Family Guy and many more popular shows. Catch up on classic series including Lost, Battlestar Galactica and I Love Lucy, or explore Hulu Original and Exclusive series. Enjoy Hulu Kids shows and thousands of critically acclaimed movies ad-free. Browse all Hulu Plus content <a class='blue-link' href='/plus/content' target='_blank'>here</a>.",
devices_link: "What devices support Hulu Plus?",
devices_desc: "Hulu Plus is available on connected TVs and Blu-ray players, gaming consoles, set-top boxes, tablets, mobile phones, and more. Easily watch your favorite shows on all your devices: start watching on your phone and continue watching on your TV. </br></br> For a list of devices currently enabled with Hulu Plus, please visit our  <a class='blue-link' href='/plus/devices' target='_blank'>Devices Page</a>.  You'll also find our devices that are coming soon listed there &mdash; and you can sign up to be notified when they do become available.",
ads_link: "Why are there ads?",
ads_desc: "We include advertisements in Hulu Plus in order to reduce the monthly subscription price of the service. Premium content &mdash; especially from the current TV season &mdash; is expensive to make and license.  </br></br>  We have found that by including a modest ad load, we can keep the price for Hulu Plus under eight bucks, while still providing users with access to the most popular current season shows on the devices of their choice.",
more: "More"
},
thanks: {
welcome: "Welcome to Hulu Plus.",
welcome_detail: 'Personalize your experience or <a class="blue-link navigate" href="/">start watching now.</a>',
personalize: "PERSONALIZE",
device_setup_link: "SET UP YOUR DEVICE",
tell_friends_link: "TELL FRIENDS",
device_setup: {
phone_or_tablet: "Set up Hulu Plus on your smartphone or tablet",
email_offer: "Want us to send you a link to download the Hulu Plus app?",
email_button: "Send me a link to the app",
email_sent: "You'll get an email shortly",
tv_or_other: "Set up Hulu Plus on your TV or other devices",
step_one: "Step 1",
step_one_desc: "Turn on your device, download the Hulu Plus app from the app store and launch it.",
step_two: "Step 2",
step_two_desc: "Find the login screen.  Here you should see an activation code as in the example below.",
step_three: "Step 3",
step_three_desc: "Enter your activation code in the field below to automatically log in on your device.",
activation_button: "Enter",
faq: "Frequently Asked Device Questions",
faq_devices: "What devices support Hulu Plus?",
faq_activation_code: "Where is the activation code?",
faq_activation_code_title: "How to Find Your Activation Code",
faq_activation_code_step_1: "Make sure your device is connected to the internet.",
faq_activation_code_step_2: "Open the Hulu Plus application on your device.",
faq_activation_code_step_3: 'You will be asked "Are you already a Hulu Plus subscriber?" Click "No" and you will see the screen below with your activation code.',
next_step: "Next step: Tell Friends ▶",
activation_error: "Invalid code. Please try again.",
activation_success: "Activation successful!"
},
tell_friends: {
title: "Tell your friends, get up to <b>1 year</b> free.",
description: "Hulu Plus is more fun with friends, and if they signup using your unique link you'll get 2 additional free weeks of Hulu Plus for each sign-up.  Choose how you want to send your message:"
},
manage_emails: "Manage Your Emails",
manage_emails_desc: 'Customize your email preferences from Hulu, or choose to opt out of individual emails. Visit <a class="blue-link" target="_blank" href="/profile/notification_management">Notification Management</a> to make changes.',
share_text: "I'm watching my favorite TV shows with Hulu Plus. Try it now & get 2 weeks free! %{link}"
}
},
smart_start: {
watch_default: "Watch %{type}",
preview_default: "Preview %{type}",
watch_latest_episode: "Watch Latest Episode",
watch_latest_episode_classic: "Watch Latest Free Episode",
watch_first_episode: "Start Watching",
resume_episode: "Resume Episode",
rewatch_latest_episode: "Watch Again",
watch_next_episode: "Watch Next Episode",
watch_movie: "Watch Movie",
resume_movie: "Resume Movie",
watch_latest_clip: "Watch Latest Clip",
watch_popular_clip: "Watch Most Popular Clip",
preview_next_episode: "Preview Next Episode",
preview_first_episode: "Watch Preview",
preview_latest_episode: "Preview Latest Episode"
},
social: {
fbinstantly: "Log in instantly with Facebook",
fbsignup: "Sign up instantly with Facebook",
signupnofb: "Sign up without Facebook",
fblogin: "Log in with Facebook",
ison: "on",
isoff: "off",
sharedactivity: "Shared Activity",
previouslyshared: "Previously Shared Activity",
benefit: {
title: "Hulu Gets Better With Friends",
list_1: "Share what you love with your friends",
list_2: "See the videos your friends want to share",
list_3: "Improve your recommendations"
},
linked: "Your Hulu account is linked to:",
manage: "manage",
sharing: "Social Sharing",
fbnewaccount: "Since you've logged in with Facebook, we need to create a Hulu account for you. To set up your Hulu account, we'll use your Facebook profile information. Interested? Just create a Hulu password below. Your profile information can always be accessed and reviewed by you within the Hulu Account Settings.",
updating: "Updating Your Profile",
fbmerge: "Since you've logged in with Facebook, we've updated your account with your Facebook profile information. All your profile information from Facebook can be viewed in your Hulu Account Settings.",
"continue": "Continue",
newfeature: "New feature",
fblogo: "Facebook logo",
startsharing: "Start Sharing What You Watch",
logintoshare: "Log in with Facebook to turn your Social Sharing On",
sharenext: "Turning on Social will take effect in the next video",
importedfriends: "To help you share, we've imported all of your Facebook friends who have connected to Hulu through Facebook.",
roadblockdetails: "Other things you should know:",
control: "You're always in control of how and when you share your Hulu activity.",
separate: "Your Facebook and Hulu privacy settings are separate and should be configured on their respective sites.",
future: "Facebook friends who connect to Hulu in the future will see your activity on Hulu.",
unshare: "If you don't want to share your Hulu activity with all of your Facebook friends, just click 'Don't share my activity.'",
ready: "Ready to start sharing videos you watch, favorite, or rate with your friends on Facebook and Hulu?",
dontshare: "Don't Share My Activity (Social Off)",
sharemyactivity: "Share My Activity (Social On)",
pendingdelete: "This is pending deletion from Facebook.",
moreinfo: "More info",
noactivity: "No recent activity shared.",
viewallactivity: "View all shared activity",
fbshared: "Shared on Facebook and Hulu",
fbremove: "Remove from Facebook and Hulu",
remove: "Remove",
socialon: "Social On",
socialoff: "Social Off",
viewall: "View All",
shareyourvote: "Share your vote",
follow: "Follow @%{handle}"
},
spotlight: {
livestream: {
id: "0",
thumb: "http://assets.huluim.com/spotlight/spotlight-livestream.jpg",
headerTitle: "Live Coverage",
moreLink: "http://www.hulu.com/live",
info: 'Visit Hulu\'s <a href="http://hulu.com/live">Live Events</a>hub to watch live coverage of key debates and more.<br/> Check often for the latest schedule.',
learnmore: "Learn More",
startAtPrefix: "Stream Begins: "
},
election: {
keyArtUrl: "http://assets.hulu.com/spotlight/2012/key_art_election_1600x400.jpg",
facebook: {
thumb: "http://assets.huluim.com/spotlight/2012/facebook_share_thumb_election.jpg",
text: 'From "SNL" and "The Daily Show" to ABC News and Fox News, get every angle on each candidate before elections day.'
},
twitter: {
text: 'Hulu\'s election center: From the news to "SNL," get every angle on each candidate before elections day.'
},
shareLink: "http://www.hulu.com/election",
shareTitle: "Election",
shareType: "website"
},
huluween: {
keyArtUrl: "http://assets.huluim.com/spotlight/2012/key_art_huluween.jpg",
facebook: {
thumb: "http://assets.huluim.com/spotlight/2012/facebook_share_thumb_huluween.jpg",
text: "Welcome to the best little gore house on Hulu. Check out our collection of creepy TV shows and movies, from classic slasher flicks to family-friendly frights."
},
twitter: {
text: "Check out Hulu's best scares, thrills and flinches all in one place."
},
shareLink: "http://www.hulu.com/huluween",
shareTitle: "Hulu - Huluween",
shareType: "website"
},
holiday_entertaining: {
keyArtUrl: "http://assets.huluim.com/spotlight/2012/key_art_holiday_entertaining.jpg",
facebook: {
thumb: "http://assets.huluim.com/spotlight/2012/facebook_share_thumb_holiday_entertaining.jpg",
text: "Feast on homemade holiday treats this Christmas with seasonal menu ideas, recipes, and more from your favorite Food Network chefs."
},
twitter: {
text: "Check out recipes and DIY tips just the winter season on @Hulu's holiday entertaining guide: "
},
shareLink: "http://www.hulu.com/holiday-entertaining",
shareTitle: "Hulu - Holiday Entertaining",
shareType: "website"
},
blockbusters: {
keyArtUrl: "http://assets.huluim.com/spotlight/2012/key_art_holiday_blockbuster_guide.jpg",
shareLink: "http://www.hulu.com/blockbusters",
shareTitle: "Hulu - Holiday Blockbuster Guide",
shareType: "website",
available_now: "IN THEATERS NOW",
coming_soon: "Coming In:",
no_data: "Check back soon for more blockbusters!",
facebook: {
thumb: "http://assets.huluim.com/spotlight/2012/facebook_share_thumb_holiday_blockbuster_guide.jpg",
text: "We rounded up winter's biggest movies, from Bond to Breaking Dawn. Watch the trailers and get the lowdown on the most-anticipated flicks of the holiday season."
},
twitter: {
text: "Check out the hottest movies of this holiday season @hulu "
}
},
holidays: {
keyArtUrl: "http://assets.huluim.com/spotlight/2012/key_art_holidays.jpg",
headline: "More to Watch Every Weekday",
description: "Capture the spirit of the season with festive episodes, family-friendly movies, and holiday specials on Hulu. Check back every weekday through Christmas for more additions to our lineup.",
shareTitle: "Hulu - Hulu for the Holidays",
shareType: "website",
shareLink: "http://www.hulu.com/holidays",
facebook: {
thumb: "http://assets.huluim.com/spotlight/2012/facebook_share_thumb_holidays.jpg",
text: "Get in the holiday spirit on Hulu. Festive titles revealed each day."
},
twitter: {
text: "Getting in the holiday spirit @hulu "
}
},
best_of_2012: {
keyArtUrl: "http://assets.huluim.com/spotlight/2012/key_art_best_of_2012.jpg",
facebook: {
thumb: "http://assets.huluim.com/spotlight/2012/facebook_share_thumb_best_of_2012.jpg",
text: "Watch the top TV and celebrity moments of 2012 on Hulu."
},
twitter: {
text: "Check out the top moments of 2012 on @hulu "
},
shareLink: "http://www.hulu.com/best-of-2012",
shareTitle: "Hulu's Best of 2012",
shareType: "website"
},
winter: {
keyArtUrl: "http://assets.huluim.com/spotlight/2013/key_art_winter_premieres.jpg",
shareLink: "http://www.hulu.com/winter",
shareTitle: "Hulu - Winter TV Premieres",
shareType: "website",
available_now: "AVAILABLE NOW",
no_data: "Check back soon for more premieres!",
facebook: {
thumb: "http://assets.huluim.com/spotlight/2013/facebook_share_thumb_winter_premieres.jpg",
text: "From Sean's turn on \"The Bachelor\" to Kevin Bacon's return to the small screen in \"The Following,\" we've got you covered on this season's best TV. Read up on the rookies and returning champs of winter TV and watch them on Hulu."
},
twitter: {
text: "Get ready for this season's TV lineup with @hulu's Winter Premieres guide #huluwintertv "
}
},
coming_soon: "Coming In:",
game_day_101: {
keyArtUrl: "http://assets.huluim.com/spotlight/2013/key_art_game_day_101.jpg",
shareLink: "http://www.hulu.com/game-day-101",
shareTitle: "Hulu - Game Day 101",
shareType: "website",
facebook: {
thumb: "http://assets.huluim.com/spotlight/2013/facebook_share_thumb_game_day_101.jpg",
text: "Get ready for the Super Bowl with these tasty recipes and tips, whether you're tailgating or throwing a football-watching party at home."
},
twitter: {
text: "Get ready for the big game with these winning recipes @hulu "
}
},
bestinshow: {
keyArtUrl: "http://assets.huluim.com/spotlight/2013/key_art_bis.jpg",
shareLink: "http://www.hulu.com/bestinshow",
shareTitle: "Hulu's Best in Show: Vote for the Best TV Show of 2013",
shareType: "website",
social_callout: "Follow @Hulu on Twitter for Best in Show updates",
facebook: {
thumb: "http://assets.huluim.com/spotlight/2013/facebook_share_thumb_bis.jpg",
text: "Hulu is partnering with Rolling Stone to present the fourth annual Best in Show: Tell us your picks for the most era-defining shows on TV today. We'll announce the winning series on April 4."
},
twitter: {
text: "It's #HuluBestinShow time. What's the best TV show of 2013? @Hulu is partnering with @RollingStone to find out. Vote: "
},
voting: {
share_title: "Vote for the Best TV Show of 2013",
facebook: {
text: "I voted for %{v} in Hulu's 2013 Best in Show."
}
}
}
},
survey: {
oscars2013: {
button_text: "Vote Now",
results_title: "Hulu users voted for...",
thanks_title: "Thanks for your vote - tell your friends!",
whats_your_pick: "What's your pick for %{category}?",
who_should_win: "Who should win for %{category}?",
facebook: {
share_text: "Vote on who you think will take home the golden prize. We've got our own picks - what are yours? Let the race begin!",
share_link: "http://www.hulu.com/oscars/voting?c=%{category}&v=%{choice}"
},
twitter: {
share_text: "I voted for %{choice} to win %{category} in Hulu's 2013 #Oscars Ballot. Vote here: ",
share_link: "http://www.hulu.com/oscars"
}
}
},
tile: {
expire_message: {
expire_day: {
one: "Expires in 1 day",
other: "Expires in {{count}} days",
zero: ""
},
expire_hour: {
one: "Expires in 1 hour",
other: "Expires in {{count}} hours",
zero: ""
}
},
auth_message_fox: "Available through participating TV Providers",
auth_message_nbc: "Available through participating TV Providers",
offsite_watch_on: "WATCH ON",
now_playing: "NOW PLAYING",
posted_time: "{{diff}} ago"
},
tournament: {
partnership: "In partnership with",
bestinshow: {
summary: "Television is the little box that could: it's become, dare we say, the most exciting form of storytelling in recent years. From the quirky heart of \"Parks and Recreation\" to the aimless (yet charming) heart of \"Girls,\" we want to know what show defines our era today. <br/><br/>We've partnered with <i>Rolling Stone's</i> influential pop culture critic Rob Sheffield for his take on the best shows on TV. But it's all about your vote. We've rounded up 32 TV shows for a bracket-style competition so that each week, the winning shows — based solely on the fans' votes — will advance, all the way until we reach No. 1. Cast your votes for Hulu's fourth annual \"Best in Show\" and find out the winner on April 4.",
partner_social: "Find Rob Sheffield at <a href='http://www.rollingstone.com' class='blue-link' target='_blank'>www.rollingstone.com</a> and follow Rolling Stone's Twitter <a href='http://www.twitter.com/rollingstone' class='blue-link' target='_blank'>@rollingstone</a>",
partner_logo: "<a href='http://www.rollingstone.com' target='_blank'><img src='http://assets.huluim.com/spotlight/logos/logo-rollingstone.png' /></a>",
button_text: "Vote",
facebook: {
share_text: "Vote for the Best TV Show of 2013",
share_link: "http://www.hulu.com/bestinshow/voting?v=%{choice}"
},
twitter: {
share_text: "I voted for %{choice_hashtag} in #bestinshow @hulu. Cast your votes now: ",
share_link: "http://www.hulu.com/bestinshow"
},
rounds: {
unavailable: "Don't forget to come back next week to vote.",
round0: {
title: "Week 1",
subTitle: "February 28 - March 6"
},
round1: {
title: "Week 2",
subTitle: "March 7 - 13"
},
round2: {
title: "Week 3",
subTitle: "March 14 - 20"
},
round3: {
title: "Week 4",
subTitle: "March 21 - 27"
},
round4: {
title: "Week 5",
subTitle: "March 28 - April 3"
}
}
}
},
tray_name: {
personalized_shows: "Recommended for You",
popular_clips: "Popular Clips",
popular_episodes: "Popular Episodes",
popular_movies: "Popular Movies",
popular_movie_trailers: "Popular Movie Trailers",
popular_movie_clips: "Popular Movie Clips",
popular_shows: "Popular Shows",
popular_documentaries: "Popular Documentaries",
popular_criterion: "Popular Criterion Movies",
popular_short_films: "Popular Shorts",
popular_genres: "Popular Genres",
popular_titles: "Popular Titles",
popular_in_genre: "Popular in {{name}}",
popular_in_kids: "Popular in Kids",
popular_from_company: "Popular from {{name}}",
recent_shows: "Recently Added Shows",
recent_videos: "Recently Added Videos",
recent_episodes: "Recently Added Episodes",
yesterday_date: "Yesterday, %{month_name} %{day_of_month}",
recent_movies: "Recently Added Movies",
recent_movie_trailers: "Recently Added Movie Trailers",
recent_movie_clips: "Recently Added Movie Clips",
recent_documentaries: "Recently Added Documentaries",
recent_criterion: "Recently Added in Criterion",
recommended_shows: "Recommended for You",
recommended_videos: "Recommended Videos",
recommended_documentaries: "Recommended Documentaries",
recommended_criterion: "Recommended Criterion Movies",
recommended_editorial: "More to Watch",
popular_this_week: "Popular This Week",
popular_today: "Popular Today",
top_clips: "Top 25 Clips",
top_recommended_shows: "Recommended for You",
trailers_in_theaters_now: "Movie Trailers: In Theaters Now",
trailers_coming_soon: "Movie Trailers: Coming Soon",
trailers_opening_this_week: "Movie Trailers: Opening This Week",
exclusively_on_hulu: "Exclusively on Hulu",
what_you_are_watching: "Shows You Watch",
anonymous_what_you_are_watching: "Your Shows",
viewers_also_watched: "You May Also Like",
episodes: "Episodes",
clips: "Clips",
movies: "Movies",
games: "Games",
home_nav_tile: "",
tv_tile: "",
movie_tile: "",
popular_networks: "Popular Networks",
popular_tv_networks: "Popular Networks",
networks: "Networks",
now_playing: "Now Playing",
popular_movies_studios: "Popular Studios",
studios: "Studios",
season: "Season",
episode: "Episode",
more_from: "More From ",
more_movie_trailers: "More Movie Trailers",
most_popular: "Most Popular",
popular_from: "Popular from",
popular_in: "Popular in",
all_genres: "All Genres",
other_category: "Others",
recommended: "Recommended",
recommended_in: "Recommended in",
recently_added: "Recently Added",
recently_added_in: "Recently Added In",
all_networks: "All Networks",
available_elsewhere: "Available Elsewhere",
seasons_grid: "Season {0}",
all_seasons: "All Seasons",
video_game_clips_more_from: "More from %{title}",
video_game_news: "News from The Electric Playground",
video_game_reviews: "Reviews by GameTrailers",
video_game_trailers: "Trailers",
video_game_trailers_featured: "Featured Trailers",
video_game_trailers_featured_verbose: "Featured Video Game Trailers",
video_game_trailers_latest: "Latest Trailers",
video_game_trailers_top: "Top Trailers",
video_game_trailers_top_verbose: "Top Video Game Trailers",
video_games_releasing_this_month: "Games Releasing This Month",
video_games_coming_soon: "Popular Upcoming Games",
video_games_featured: "Featured Games",
video_games_popular: "Popular Games",
video_games_recommended: "Recommended Games",
browse_all: "Browse All",
a_to_z: "A-Z",
adzone: "%{year} Super Bowl Ads",
adzone_top: "Top %{year} Super Bowl Ads",
adzone_teasers: "%{year} Teasers and Previews",
adzone_extras: "Extras",
adzone_browse_all: "Browse All %{year} Super Bowl Ads"
},
v_list_tile: {
available_on: "Available on",
"new": "New!",
in_theaters: "In Theaters",
featured_on: "Featured on",
verdict_label: "For fans of:",
watch_now: "Watch Now",
watch_trailer: "Watch Trailer"
},
video: {
episode: "Episode",
clip_season_format: "From Season {{seasonNumber}}&nbsp;&nbsp;Episode {{episodeNumber}}",
video_season_format: "Season {{seasonNumber}}&nbsp;&nbsp;Episode {{episodeNumber}}",
movie_season_format: "Movie",
air_date: "Aired on %{date}",
in_theaters_date: "In theaters %{date}",
in_stores_date: "In stores %{date}"
},
video_game: {
more: "more",
hide: "hide",
release_date: "Release Date: {{date}}",
platforms: "Platforms: {{platforms}}",
publishers: "Publisher: {{publishers}}",
developers: "Developer: {{developers}}",
genres: "Genres: {{genres}}",
rating_title_ao: "AO for Adults Only",
rating_title_e: "E for Everyone",
"rating_title_e10+": "E10 for Everyone 10+",
rating_title_ec: "EC for Early Childhood",
rating_title_m: "M for Mature",
rating_title_rp: "RP for Rating Pending",
rating_title_t: "T for Teen",
season_fall: "Fall {{year}}",
season_spring: "Spring {{year}}",
season_summer: "Summer {{year}}",
season_winter: "Winter {{year}}"
},
video_player: {
player_version_error_message: 'Hulu requires Flash Player 10.1.53.64 or higher. Please <a href="http://get.adobe.com/flashplayer/">download</a> and install the latest version of Flash Player before continuing.',
shared_text: "Check Out %{shared_name} on Hulu.\n( %{shared_link} )",
pop_up_message: "Oops - your browser may be blocking this pop-up. Please disable your pop-up blocker before continuing.",
return_video: "Return To Video",
close: "Close Video",
to: "To",
note: "Note",
send_email: "send email",
messege_sent: "Message sent.",
email_address_hint: "Use commas to separate more than one email address"
},
email_share: {
address_invalid: "The email address is invalid.",
tips: "Tips",
verify_email: "In our new efforts to combat spam on Hulu, we now require users to verify their email addresses before posting on Hulu. Please first verify your email address before continuing.<br><br>Would you like us to send a verification request to %{email} now?",
btn_yes: "Yes",
btn_no: "No ",
fail_to_get_address: "Oops! Fail to get the email address.",
request_has_sent: "Verification request has sent.",
fail_to_send: "Oops! Fail to send the verification request.",
error_while_sending: "An error occurred while sending email."
}
}
}, I18n.locale = "en-us";;