class Graph < ApplicationRecord
  belongs_to :user
  validates :date, presence: true, uniqueness: { scope: :user_id }
  validates :yen, presence: true
  def self.chart_data(user)
    graphs = user.graphs.order(date: :asc)
    return [{ date: Date.today, yen: nil }] if graphs.empty?

    period = graphs[0].date..graphs[-1].date
    index = 0
    period.map do |date|
      if graphs[index].date == date
        yen = graphs[index].yen
        index += 1
      end
      { date: date, yen: yen }
      end
    end
end
