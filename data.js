/* data.js - the course content. Edit lesson text, quiz questions and business examples here. */
window.DD=window.DD||{};
(function(){
/* ---------- business types ---------- */
var BIZ={
 kirana:{label:'Kirana store',shop:'kirana store',item:'fresh atta, dal and daily needs',offer:'free home delivery above ₹500',post:'fresh vegetables that arrived today'},
 salon:{label:'Salon',shop:'salon',item:'haircuts and facials',offer:'10% off on your next visit',post:'a before and after hair makeover'},
 food:{label:'Restaurant',shop:'restaurant',item:'thali and snacks',offer:'a free sweet with orders above ₹400',post:'today’s special dish'},
 boutique:{label:'Boutique',shop:'clothing boutique',item:'kurtis and sarees',offer:'₹200 off on two pieces',post:'a new kurti collection'},
 tutor:{label:'Tuition class',shop:'tuition class',item:'maths and science classes',offer:'a free demo class',post:'a student’s result'}
};

/* ---------- lessons ---------- */
var LESSONS=[
{id:'l1',title:'What digital marketing really is',min:5,summary:'Learn the four steps every customer goes through, and set one clear goal for the next 30 days.',
 scenes:[
  {icon:'store',head:'Your shop, but online',text:'Digital marketing means using phones and the internet to help people find your {shop}, trust it, and buy from it.'},
  {icon:'search',head:'Step 1: Be found',text:'Most people search on Google or Instagram before they visit. If you do not show up, they go to someone who does.'},
  {icon:'star',head:'Step 2: Be trusted',text:'Real photos, honest reviews and quick replies on WhatsApp tell a new customer that you are real and reliable.'},
  {icon:'heart',head:'Step 3: Be remembered',text:'Offers like {offer} bring people back again and again. A returning customer costs far less than a new one.'},
  {icon:'target',head:'Start with one goal',text:'Pick one goal for 30 days, for example 20 new customers or 50 WhatsApp enquiries. Then every post and every ad has a clear job.'}],
 talk:['You do not need a big budget or a marketing degree. Many small businesses grow with a free Google profile, a WhatsApp Business account and one active social page.','A good rule is to spend 30 minutes every day, not three hours once a month. Small steady actions beat big occasional efforts.'],
 recap:'Remember the four steps: be found, be trusted, get the visit, and be remembered.',
 steps:[['search','Be found','Show up on Google Maps and Instagram when people search.'],['star','Be trusted','Real photos, honest reviews and quick replies.'],['phone','Get the visit','Make it easy to call, message or walk in.'],['heart','Be remembered','Offers and follow-ups bring people back.']],
 dos:['Pick one goal for 30 days','Use real photos of your {shop}','Reply to every enquiry the same day'],
 donts:['Try every app at once','Copy other shops’ pictures','Post only when you remember'],
 tryit:'Write one goal for your {shop} on paper: how many new customers do you want this month?',
 quiz:[{q:'Which step comes first in the customer journey?',o:['Be remembered','Be found','Run an ad','Get reviews'],a:1,why:'People must find you before anything else can happen.'},
  {q:'How much time can you give each day to start?',o:['30 minutes','5 hours','None, do it once a month','Only during festivals'],a:0,why:'Short daily actions beat one big effort every month.'},
  {q:'Why set one goal for 30 days?',o:['It looks professional','So every post and ad has a clear job','Google asks for it','To spend more money'],a:1,why:'A clear goal tells you what to post and how to measure it.'}]},

{id:'l2',title:'Get found on Google Maps',min:6,summary:'Set up a free Google Business Profile so people near you can find, call and visit your shop.',
 scenes:[
  {icon:'pin',head:'People search near them',text:'When someone searches for a {shop} near me, Google shows a map with a few shops at the top. Being one of them is worth more than a poster.'},
  {icon:'check',head:'Claim your free profile',text:'Search for your shop name on Google Business Profile and verify it using the method Google offers, such as a video or a code. It costs nothing.'},
  {icon:'image',head:'Fill in every detail',text:'Add your exact address, phone number, opening hours and category. Upload at least ten real photos of the shop, your products and your team.'},
  {icon:'star',head:'Ask for reviews',text:'After a happy sale, share your review link on WhatsApp or show a QR code at the counter. Aim for a few new reviews every month.'},
  {icon:'chat',head:'Reply and post',text:'Reply to every review. Thank the happy ones and answer the unhappy ones politely. Add a post each week about {post}.'}],
 talk:['Check your profile every Monday. Google shows how many people called you, asked for directions or visited your website.','Keep your business name exactly as it is on your signboard. Adding extra keywords to the name can get your profile suspended.'],
 recap:'A complete profile, real photos and fresh reviews. That is the whole recipe.',
 steps:[['pin','Claim your profile','Search your shop on Google Business Profile and verify it.'],['check','Fill every detail','Address, phone, hours, category and a short description.'],['image','Add real photos','At least 10 photos of the shop, products and team.'],['star','Collect reviews','Share your review link after happy sales.']],
 dos:['Use the same name as your signboard','Update hours before festivals','Reply to every review'],
 donts:['Stuff keywords into the name','Use photos from the internet','Ignore bad reviews'],
 tryit:'Open Google Maps on your phone and search for your {shop}. Is it there with the right phone number and hours?',
 quiz:[{q:'What does a Google Business Profile cost?',o:['It is free','₹500 a month','₹5,000 a year','Only shops with a website can have one'],a:0,why:'The profile is free for any business with a real location or service area.'},
  {q:'What name should you use for your business?',o:['Add many keywords to it','The same name as your signboard','A different name from the shop','Your phone number'],a:1,why:'Matching your real name keeps your profile safe and easy to recognise.'},
  {q:'When should you ask for reviews?',o:['Never','After happy sales, a few every month','Once a year','Before the customer buys'],a:1,why:'Fresh reviews show new customers that you are active and trusted.'}]},

{id:'l3',title:'Sell and reply on WhatsApp',min:6,summary:'Use the free WhatsApp Business app to show your products, answer faster and keep customers coming back.',
 scenes:[
  {icon:'chat',head:'Where your customers already are',text:'Most of your customers use WhatsApp every day. The free WhatsApp Business app is made for shops like yours.'},
  {icon:'store',head:'Set up your profile',text:'Add your shop name, address, opening hours and a short description. Customers see this before they send you a message.'},
  {icon:'tag',head:'Make a catalogue',text:'Add your top products with a photo, a price and a short description. A customer can browse and message you in one tap.'},
  {icon:'clock',head:'Use quick replies',text:'Save replies for common questions like prices and timings. Set a greeting message so every new customer gets an instant welcome.'},
  {icon:'users',head:'Use labels and broadcasts',text:'Label chats as New, Paid or Follow up. Send offers like {offer} only to people who saved your number and agreed to receive them.'}],
 talk:['Never add people to groups without asking. It annoys them, and they may block or report your number.','Share your WhatsApp link on your signboard, your bill, your Instagram bio and your Google profile, so people can message you with one tap.'],
 recap:'Profile, catalogue, quick replies and labels. Set them up once and save hours every week.',
 steps:[['store','Set up the profile','Name, address, hours and a short description.'],['tag','Build a catalogue','Top products with photos and prices.'],['clock','Save quick replies','Answers for prices, timings and location.'],['users','Use labels and lists','Sort chats and send offers to people who agreed.']],
 dos:['Reply within a few hours','Ask before adding anyone to a list','Put your WhatsApp link everywhere'],
 donts:['Add people to groups without asking','Send offers every day','Use your personal number for the business'],
 tryit:'Download WhatsApp Business and add three of your best {item} to the catalogue today.',
 quiz:[{q:'Which app is made for small businesses?',o:['WhatsApp Business','A game app','A photo editor','Email only'],a:0,why:'WhatsApp Business is free and has a catalogue, labels and quick replies.'},
  {q:'Who should receive your offer messages?',o:['Anyone with a phone number','People who saved your number and agreed','Strangers from a bought list','Only family'],a:1,why:'People who agreed will read your offers. Others may block you.'},
  {q:'What is a quick reply?',o:['A saved answer you can send in one tap','A paid advertisement','A new phone','A group chat'],a:0,why:'Quick replies save time on questions you answer every day.'}]},

{id:'l4',title:'Posts people want to see',min:6,summary:'Plan simple Instagram and Facebook posts, with a weekly rhythm you can keep up.',
 scenes:[
  {icon:'camera',head:'Show real things',text:'Customers like real photos of your {shop} more than polished posters. Use daylight and a clean background.'},
  {icon:'calendar',head:'Post three times a week',text:'Three posts a week is enough to start. Stay steady for eight weeks before you judge the results.'},
  {icon:'bulb',head:'Mix three types of posts',text:'Mix teaching, showing and selling. For example, a tip about {item}, a post showing {post}, and the offer {offer}.'},
  {icon:'video',head:'Try short videos',text:'A video of 15 to 30 seconds on your phone often reaches more new people than a photo. Show a product, how you work, or a happy customer.'},
  {icon:'phone',head:'Make it easy to act',text:'End every post with one clear action: call now, message us on WhatsApp, or visit today. Put your WhatsApp link in your bio.'}],
 talk:['Write captions in the language your customers speak, whether that is Hindi, Marathi, Tamil or English. Short and simple works best.','Ask permission before showing a customer’s face or name. Happy customers usually say yes, and it builds trust.'],
 recap:'Real photos, three posts a week, and one clear action at the end of each post.',
 steps:[['camera','Real photos','Daylight, clean background, your own products.'],['calendar','Three posts a week','A rhythm you can keep for eight weeks.'],['bulb','Mix post types','Teach, show and sell.'],['video','Short videos','15 to 30 seconds, shot on your phone.'],['phone','One clear action','Call, message or visit.']],
 dos:['Use daylight for photos','Write in your customers’ language','Add your WhatsApp link to your bio'],
 donts:['Post blurry or copied pictures','Ask for five things in one post','Give up after two weeks'],
 tryit:'Take three photos of {post} in daylight and save them. You now have next week’s posts.',
 quiz:[{q:'How many posts a week is a good start?',o:['About 3','30','1 every month','Only on Sundays'],a:0,why:'Three steady posts a week is easy to keep up and still visible.'},
  {q:'What is a good way to end a post?',o:['With no action','With one clear action like Message us on WhatsApp','With five different links','With a long story'],a:1,why:'One clear action makes it easy for people to become customers.'},
  {q:'Which photos work best?',o:['Real photos in daylight','Photos copied from other shops','Blurry photos','Only stock images'],a:0,why:'Real photos show what a customer will actually get.'}]},

{id:'l5',title:'Small ads and a smart budget',min:6,summary:'Spend a small amount on local ads, and learn how to tell whether the money worked.',
 scenes:[
  {icon:'store',head:'Fix the basics first',text:'Set up your Google profile and WhatsApp first. Ads work best when there is a good place to send people.'},
  {icon:'target',head:'Choose who sees it',text:'Set a radius of a few kilometres around your shop and an age range for your likely customers. Do not target the whole country.'},
  {icon:'rupee',head:'Start small',text:'Start with a small daily budget, for example ₹100 a day for five days. Watch how many messages you get.'},
  {icon:'image',head:'Boost your best post',text:'Pick a post that already got likes and comments. Add a button such as Send message so people reach you on WhatsApp.'},
  {icon:'chart',head:'Count and decide',text:'Cost per enquiry is the money you spent divided by the messages you received. If it is low, spend a little more. If it is high, change the photo or the offer.'}],
 talk:['Never boost a post with wrong prices or an old offer. Check every word before you spend money.','Try the budget calculator in the Tools section to estimate how many customers you may get from a small test.'],
 recap:'Basics first, a local audience, a small budget, and one number to watch: cost per enquiry.',
 steps:[['store','Fix the basics','Google profile and WhatsApp ready first.'],['target','Local audience','A few kilometres around your shop.'],['rupee','Small budget','For example ₹100 a day for five days.'],['image','Best post','Boost something people already liked.'],['chart','Count enquiries','Spend divided by messages received.']],
 dos:['Test with a small budget','Check prices before boosting','Write down your results'],
 donts:['Target the whole country','Boost without a Send message button','Spend more before you see results'],
 tryit:'Open the budget calculator in Tools and try ₹100 a day for five days with your own average sale.',
 quiz:[{q:'What should you set up before running ads?',o:['Ads before anything','A Google profile and WhatsApp','A TV advert','A large office'],a:1,why:'Ads send people somewhere. Make sure that place is ready.'},
  {q:'Who should see a local ad?',o:['Everyone in the country','People within a few km of your shop','Only foreign customers','Nobody'],a:1,why:'People who live near you are the ones who can visit.'},
  {q:'How do you work out cost per enquiry?',o:['Money spent divided by messages received','Likes divided by followers','Phone price','Shop rent'],a:0,why:'It tells you how much each message cost you.'}]},

{id:'l6',title:'Reviews, offers and tracking',min:5,summary:'Earn honest reviews, run one simple offer, and find out which of your efforts brings customers.',
 scenes:[
  {icon:'star',head:'Reviews build trust',text:'Most people read reviews before they visit. A shop with many honest reviews often wins over one with very few.'},
  {icon:'tag',head:'Make one simple offer',text:'An offer such as {offer} gives people a reason to act now. Add an end date so they do not wait.'},
  {icon:'users',head:'Ask how they found you',text:'At the counter, ask every new customer how they found you. Write it in a notebook, and after a month you will see what works.'},
  {icon:'tag',head:'Use offer codes',text:'Give each channel its own code, like INSTA10 or GOOGLE10. When a customer says the code, you know where they came from.'},
  {icon:'chart',head:'Review every month',text:'Once a month, count new customers by source. Do more of what works and stop what does not.'}],
 talk:['Never buy fake reviews or write them yourself. Customers and Google can spot them, and your profile may be penalised.','Thank every customer who reviews you. A short, real reply makes the next customer trust you.'],
 recap:'Honest reviews, one simple offer, a code for each channel, and a monthly count.',
 steps:[['star','Earn reviews','Ask happy customers and reply to each one.'],['tag','One simple offer','With an end date.'],['users','Ask how they found you','Write it in a notebook.'],['tag','Offer codes','One code for each channel.'],['chart','Monthly check','Count customers by source.']],
 dos:['Thank every reviewer','Add an end date to offers','Count customers by source each month'],
 donts:['Buy or write fake reviews','Run five offers at once','Guess what is working'],
 tryit:'Choose two offer codes today, one for Instagram and one for Google, and tell your staff to ask for them.',
 quiz:[{q:'What is the best way to see where customers come from?',o:['Guess','Ask them and use offer codes','Ignore it','Copy a rival'],a:1,why:'Asking and codes give you real numbers instead of guesses.'},
  {q:'Fake reviews are…',o:['A smart trick','Risky and can hurt your profile','Free advertising','Recommended by Google'],a:1,why:'They break trust, and platforms can remove them or penalise you.'},
  {q:'How often should you review your results?',o:['Every month','Never','Only at Diwali','Every five years'],a:0,why:'A monthly check is often enough to see what is working and change quickly.'}]}
];


DD.BIZ=BIZ;
DD.LESSONS=LESSONS;
})();
