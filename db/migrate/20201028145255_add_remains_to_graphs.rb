class AddRemainsToGraphs < ActiveRecord::Migration[6.0]
  def change
    add_column :graphs, :remain, :integer
  end
end
