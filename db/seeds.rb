 EMAIL = 'test@example.com'

START_DATE = Date.today - 11.months
END_DATE = Date.today + 1.months

NO_RECORD_CONSTANT = 5

MIN_YEN = 3000
MAX_YEN = 80000
DIV_CONSTANT = 10

MIN_REMAIN = 1000
MAX_REMAIN = 95000


user = User.find_or_create_by!(email: EMAIL) do |user|
  user.password = SecureRandom.urlsafe_base64
  puts 'テストユーザーの初期データインポートに成功しました。'
end

user.graphs.destroy_all

graphs = []
(START_DATE..END_DATE).each do |date|
 next if rand(NO_RECORD_CONSTANT).zero?
  graphs << {
    user_id: user.id,
    date: date,
    yen: rand(MIN_YEN..MAX_YEN) / DIV_CONSTANT,
    remain: rand(MIN_REMAIN..MAX_REMAIN),
  }
end

Graph.create!(graphs)
puts '金額の初期データ投入に成功しました！'

